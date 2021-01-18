
<template>
  <el-dialog title="新增部门" :visible="showDialog">
    <!-- 表单组件  el-form   label-width设置label的宽度   -->
    <!-- 匿名插槽 -->
    <el-form label-width="120px" :model="formData" :rules="rules">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="formData.manager" style="width:80%" placeholder="请选择" />
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formData.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为24 -->
      <el-col :span="6">
        <el-button type="primary" size="small">确定</el-button>
        <el-button size="small">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      formData: {
        name: '',
        code: '',
        manager: '',
        introduce: ''

      },
      rules: {
        name: [
          { required: true, trigger: 'blur', message: '部门名称不能为空' },
          { min: 1, max: 50, trigger: 'blur', message: '部门名称要求1到50个字符' }
        ],
        code: [
          { required: true, trigger: 'blur', message: '部门代码不能为空' },
          { min: 1, max: 50, trigger: 'blur', message: '部门代码要求1到50个字符' }
        ],
        manager: [
          { required: true, trigger: 'blur', message: '负责人不能为空' }
        ],
        introduce: [
          { required: true, trigger: 'blur', message: '介绍不能为空' },
          { min: 1, max: 300, trigger: 'blur', message: '介绍要求1到300个字符' }
        ]
      }
    }
  }
}
</script>

<style>

</style>
