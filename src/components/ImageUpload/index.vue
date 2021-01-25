<template>
  <div>
    <!-- action 执行后端地址, 之后需要用腾讯云, 所以给一个 # 另外用 http-request 覆盖默认请求 -->
    <el-upload
      action="#"
      :http-request="upload"

      list-type="picture-card"
      :on-preview="preview"
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
      previewUrl: ''
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
    }
  }
}
</script>

<style>

</style>
