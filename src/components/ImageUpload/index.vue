<template>
  <div>
    <!-- action 执行后端地址, 之后需要用腾讯云, 所以给一个 # 另外用 http-request 覆盖默认请求 -->
    <!-- 当前上传组件需要知道有多少张图片, 如果已经有图片, 就不能再上传
    我们需要用一个数组来管理这些图片 -->
    <el-upload
      action="#"
      :http-request="upload"

      list-type="picture-card"

      :file-list="fileList"
      :on-preview="preview"
      :class="{disabled: fileList.length >= 1}"
      :on-change="onChange"
      :on-remove="onRemove"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-progress v-if="showProgress" :percentage="percentage" style="width:180px" />
    <!-- 预览弹窗 -->
    <el-dialog title="预览" :visible.sync="showDialog">
      <el-row type="flex" justify="center">
        <img :src="previewUrl" alt="">
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
// 引入腾讯云sdk
import COS from 'cos-js-sdk-v5'
// 利用这个 sdk 创建一个工具实例
import config from '@/private-config'
const cos = new COS(config)
export default {
  data() {
    return {
      showDialog: false,
      previewUrl: '',

      // 这个 fileList 就是用来管理图片用的
      // 里面的每个元素都是图片对象
      // 可以先创建一张固定的图片做测试
      fileList: [],
      currentFileUid: '',
      percentage: 0,
      showProgress: false
    }
  },
  methods: {
    upload(data) {
      console.log(data)
      // 真的上传图片
      // 可以接受到当前上传组件的配置, 包括图片文件
      if (data.file) {
        // 利用腾讯云的sdk 实例 cos
      // 调用函数 cos.putObject(options, callback)
        cos.putObject({
        // 储存桶名字
          Bucket: 'weiwei-1300310660',
          // 地区
          Region: 'ap-guangzhou',
          // 上传后的文件名, 一般用文件名本身或者创建一个随机字符串即可
          // 因为对象储存, key 都是唯一的, 所以这里加上图片大小作为 key
          // 可以避免上传同名文件造成的覆盖
          Key: data.file.size + data.file.name,
          // 储存类型, 默认即可
          StorageClass: 'STANDARD',
          // 图片文件本身
          Body: data.file,
          onProgress: (progressData) => {
            this.percentage = Math.floor(progressData.percent * 100)
          }
        // onProgress: function(progressData) {
        //   console.log(JSON.stringify(progressData))
        // }
        }, (err, data) => {
        // 回调函数, 接收两个数据 err 是错误, data 是结果
          console.log(err || data)
          // 之前记录了被上传的文件 uid
          // 现在上传成功了 图片地址就在 data.Location 里面
          // 在 fileList 当中找到上传的图片, 替换其中的 url
          // (虽然现在只有一张,拿出来即可)
          // this.fileList[0].url = 'http://' + data.Location
          this.fileList = this.fileList.map(item => {
            if (item.uid === this.currentFileUid) {
              item.url = 'http://' + data.Location
              // 笔记中嗨额外在这里多添加了一个属性
              // 其实是为了标注当前图片是否是线上图片
              // 之后用来修改用户数据的时候, 如果一张图片还没有上传成功
              // 没有 upload = true 就会阻止修改
              item.upload = true
            }

            return item
          })
          setTimeout(() => {
            this.showProgress = false
            this.percentage = 0
          }, 1000)
        })
      }
    },
    // 预览函数
    preview(file) {
      console.log(file)
      // 1. 将图片地址放入 img
      this.previewUrl = file.url
      // 2. 弹窗
      this.showDialog = true
    },
    onChange(file, fileList) {
      // 这里的第二个参数 fileList 就是最新的文件列表
      // 只需要将这个值复制到 this.fileList
      this.fileList = [...fileList]
    },
    onRemove(file, fileList) {
      this.fileList = [...fileList]
    },
    beforeUpload(file) {
      // 校验大小
      const maxSize = 1 * 1024 * 1024
      if (file.size > maxSize) {
        this.$message.error('图片不能超过 1M 大小')
        return false
      }

      // 校验类型
      const types = ['image/jpeg', 'image/png']
      if (types.indexOf(file.type) === -1) {
        this.$message.error('只支持 jpge / png 格式')
        return false
      }
      this.currentFileUid = file.uid
      // 上传之前将进度条显示出来
      this.showProgress = true
      return true
    }
  }
}
</script>

<style lang="scss" scoped>

.disabled {
  // scss 不支持 /deep/
  // 需要换成对应的 ::v-deep
  ::v-deep .el-upload--picture-card {
    display: none;
  }
}
</style>

