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

    <!-- 预览弹窗 -->
    <el-dialog title="预览" :visible.sync="showDialog">
      <el-row type="flex" justify="center">
        <img :src="previewUrl" alt="">
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showDialog: false,
      previewUrl: '',

      // 这个 fileList 就是用来管理图片用的
      // 里面的每个元素都是图片对象
      // 可以先创建一张固定的图片做测试
      fileList: [

      ]
    }
  },
  methods: {
    upload() {

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

