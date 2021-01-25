<template>
  <div>
    <!-- action 执行后端地址, 之后需要用腾讯云, 所以给一个 # 另外用 http-request 覆盖默认请求 -->
    <el-upload
      action="#"
      :http-request="upload"

      list-type="picture-card"
    >
      <i class="el-icon-plus" />
    </el-upload>
  </div>
</template>

<script>
export default {
  methods: {
    upload() {

    }
  }
}
</script>

<style>

</style>
