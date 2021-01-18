<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
        <!-- 用了一个行列布局 -->
        <!-- isRoot（是否根节点） -->
        <tree-tools :tree-node="company" :is-root="true" />
        <!-- 以上是最上方公司信息行 -->
        <el-tree :data="departs" :props="defaultProps" :default-expand-all="true">
          <!-- 传入内容 插槽内容 会循环多次 有多少节点 就循环多少次 -->
          <!-- 作用域插槽 slot-scope="obj" 接收传递给插槽的数据   data 每个节点的数据对象-->
          <!-- tree-node 为传递数据的必传属性  在后面 treeNode 接收 -->
          <tree-tools slot-scope="{ data }" :tree-node="data" />
        </el-tree>
      </el-card>
    </div>
  </div>
</template>

<script>
import TreeTools from './components/tree-tools'
import { getDepartments } from '@/api/departments'

export default {
  components: {
    TreeTools
  },
  data() {
    return {
      company: { }, // 就是头部的数据结构
      departs: [],
      defaultProps: {
        label: 'name',
        children: 'children'
      }
    }
  },
  async created() {
    const res = await getDepartments()
    console.log(res)
    // 获取公司名数据 传智播客加粗的
    this.company = {
      name: res.companyName,
      manager: '负责人'
    }
    // 获取数据结构
    this.departs = res.depts
  }
}
</script>

<style scoped>
.tree-card {
  padding: 30px  140px;
  font-size:14px;
}
</style>
