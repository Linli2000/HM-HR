<template>
  <el-row
    type="flex"
    justify="space-between"
    align="middle"
    style="heiht: 40px; width: 100%"
  >
    <el-col>
      <strong v-if="isRoot">{{ treeNode.name }}</strong>
      <span v-else>{{ treeNode.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col>
          <el-dropdown @command="operateDepts">
            <span>操作</span>
            <!-- 下拉菜单 -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="edit">编辑部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="del">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartments } from '@/api/departments'

export default {
  props: {
    treeNode: {
      type: Object, // 对象类型
      required: true // 要求对方使用您的组件的时候 必须传treeNode属性 如果不传 就会报错
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    async operateDepts(type) {
      // 凡是下拉菜单被点击都会触发
      // 根据获取的 type 三种不同处理方式即可
      if (type === 'add') {
        console.log('添加')
        this.$emit('addDepts')
      }
      if (type === 'edit') {
        console.log('编辑')
      }
      if (type === 'del') {
        console.log('删除')
        // 发出请求, 删除当前被点击的栏目
        await delDepartments(this.treeNode.id)
        this.$emit('delDepts')
        this.$message.success('删除部门成功')
      }
    }
  }
}
</script>

<style >

</style>
