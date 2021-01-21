<template>
  <div class="dashboard-container">
    <div class="app-container" />
    <page-tools :show-before="true">
      <span slot="before">共 123 条记录</span>
      <template slot="after">
        <el-button size="small" type="warning">导入</el-button>
        <el-button size="small" type="danger">导出</el-button>
        <el-button size="small" type="primary">新增员工</el-button>
      </template>
    </page-tools>
    <el-card>
      <el-table border :data="list">
        <el-table-column label="序号" sortable="" type="index" />
        <el-table-column label="姓名" sortable="" prop="username" />
        <el-table-column label="工号" sortable="" prop="workNumber" />
        <!-- 可以使用**el-table-column**的**formatter**属性进行设置 枚举 -->
        <el-table-column label="聘用形式" sortable="" prop="formOfEmployment" :formatter="formatEmployment" />
        <el-table-column label="部门" sortable="" prop="departmentName" />
        <el-table-column label="入职时间" sortable="" prop="timeOfEntry">
          <template slot-scope="scope">
            <!-- 管道符的使用  前面原数据格式|管道符的格式 -->
            {{ scope.row.timeOfEntry | formatDate }}
          </template>
        </el-table-column>
        <el-table-column label="账户状态" sortable="" prop="enableState">
          <template slot-scope="scope">
            <el-switch :value="scope.row.enableState === 1" />
          </template>
        </el-table-column>
        <el-table-column label="操作" sortable="" fixed="right" width="280">
          <template>
            <el-button type="text" size="small">查看</el-button>
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small">角色</el-button>
            <el-button type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <el-row type="flex" justify="center" align="middle" style="height: 60px">
        <el-pagination layout="prev, pager, next" :total="page.total" @current-change="currentChange" />
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { getEmployeeList } from '@/api/employees'
// 引入枚举
import EmployeeEnum from '@/api/constant/employees'

export default {
  data() {
    return {
      // 接收数据
      list: [],
      page: {
        page: 1,
        size: 10,
        total: 0
      }
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    async getEmployeeList() {
      // 结构数据
      const { rows, total } = await getEmployeeList(this.page)
      this.list = rows
      // console.log(this.list)
      this.page.total = total
    },
    // 当用户点击翻页时会触发, 接收到用户选择的新页码
    // 设定翻页数据, 重新加载数据即可
    currentChange(newPage) {
      this.page.page = newPage
      this.getEmployeeList()
    },
    // 定义聘用形式的格式化函数
    formatEmployment(row, column, cellValue, index) {
      // cellValue 可以拿到页面中的值
      // 要变成什么内容, 直接 return 即可
      // 通过find 找 枚举 hireType这个对应里面的id对应的value
      // find() 方法获得当前元素集合中每个元素的后代
      // item就是找到对应hireType对象 然后如果等于我们的页面中看到的值 就是id和值相同就返回整个对象给obj 然后我们使用她的value属性
      const obj = EmployeeEnum.hireType.find(item => item.id === cellValue)
      // console.log(obj)
      return obj.value
    }

  }
}
</script>

<style>

</style>
