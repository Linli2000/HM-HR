<template>
  <div class="dashboard-container">
    <div class="app-container" />
    <page-tools :show-before="true">
      <span slot="before">共 123 条记录</span>
      <template slot="after">
        <el-button size="small" type="warning" @click="$router.push('/import?type=employee')">导入</el-button>
        <el-button size="small" type="danger" @click="exportExcel">导出</el-button>        <!--sync是接收子组件update这个方法改值不用写函数接收  -->
        <add-employee :show-dialog.sync="showDialog" @addEmployee="addEmployee" />
        <el-button size="small" type="primary" :disabled="!checkPerission('POINT-USER-ADD')" @click="showDialog = true">新增员工</el-button>
      </template>
    </page-tools>
    <el-card>
      <el-table border :data="list">
        <el-table-column label="序号" sortable="" type="index" />
        <el-table-column label="头像">
          <template slot-scope="{row}">
            <img v-imgerror="require('@/assets/common/bigUserHeader.png')" class="avatar" :src="row.staffPhoto" alt="" @click="showPopup(row.staffPhoto)">
          </template>
        </el-table-column>
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
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="$router.push(`/employees/detail/${scope.row.id}`)">查看</el-button>            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small">角色</el-button>
            <el-button type="text" size="small" @click="deleteEmployee(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <el-row type="flex" justify="center" align="middle" style="height: 60px">
        <el-pagination layout="prev, pager, next" :total="page.total" @current-change="currentChange" />
      </el-row>
    </el-card>
    <add-employee :show-dialog.sync="showDialog" @addEmployee="addEmployee" />
    <el-dialog title="二维码" :visible.sync="showCodeDialog" @opened="showQRcode">
      <el-row type="flex" justify="center">
        <canvas v-if="showCodeDialog" ref="myCanvas" />
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
// 引入枚举
import EmployeeEnum from '@/api/constant/employees'
// 引入封装的弹框
import AddEmployee from './components/add-employee'
import { formatDate } from '@/filters'
import QRcode from 'qrcode'

export default {
  components: {
    AddEmployee
  },
  data() {
    return {
      avatarImg: '',
      showCodeDialog: false,
      // 弹框的判断展示
      showDialog: false,
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
    checkPerission(key) {
      // 这个函数接收一个想要查询的权限 key
      // 然后遍历用户数据中 roles.points
      // 如果 key 存在于 points 那么返回 true 否则 false
      const { roles } = this.$store.state.user.userInfo
      return roles.points.indexOf(key) > -1
    },
    showPopup(staffPhoto) {
      if (staffPhoto) {
        // 1. 将头像地址记录
        this.avatarImg = staffPhoto
        // 2. 弹窗
        this.showCodeDialog = true
      }
    },
    showQRcode() {
      QRcode.toCanvas(this.$refs.myCanvas, this.avatarImg)
    },
    // 获取原始数据
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
      return obj ? obj.value : '不知道啊'
    },
    // delEmployee删除
    async deleteEmployee(id) {
      // console.log(11)
      // 发送删除的请求
      await delEmployee(id)
      // 如果只剩下一条数据 就向前一页
      if (this.list.length === 1 && this.page.page > 1) {
        this.page.page -= 1
      }
      // 重新获取请求页面
      this.getEmployeeList()
      // 弹框 删除成功
      this.$message.success('删除成功')
    },

    // 子组件传递的数据
    addEmployee() {
      // console.log('执行函数')
      this.getEmployeeList()
      this.showDialog = false
    },
    async exportExcel() {
      // 1. 监听按钮点击(完成)
      // 2. 加载所有数据, 其实就是将 total 总条数设为每页长度, 加载第一页即可
      const { rows } = await getEmployeeList({ page: 1, size: this.page.total })
      // 3. 根据插件需要转换数据
      // header / data
      // 这两个都可以利用字典进行生成
      const dict = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      // header 只需要将这个对象的key拿出来组成数组即可
      const header = Object.keys(dict)
      // 接着准备 data 也就是员工数组
      // 我们本来已经有一个员工数组了
      // console.log(rows)
      // 之前的数据,是一个数组包裹各个员工对象
      // 现在要将每个员工对象根据表头的顺序转换为数组,
      // 再将所有转换好的员工组成一个新数组
      // 使用映射, 将原来数组中的每个对象都映射成一个对应数组, 组成新结果 data
      const data = rows.map(user => {
        // 这里每个接到的都是 user 对象
        // 需要转成数组, 可以封装函数, 传入员工对象和字典
        // 需要返回一个合格的员工数组
        return this.objToArray(user, dict)
      })

      // 4. 调用插件进行导出
      import('@/vendor/Export2Excel').then(excel => {
        excel.export_json_to_excel({
          // 配置对象
          header,
          data,
          filename: '员工信息表',
          autoWidth: true
        })
      })
      // console.log(data)

      // 演示导出学生列表
      // 需要两个必备数据
      // 一个是表头
      // 一个是数据本身
      // const header = [
      //   'id',
      //   '姓名',
      //   '年龄'
      // ]
      // 以前一般的数据, 都是数组包裹对象
      // const students = [
      //   { id: 1, name: '王大锤', age: 12 },
      //   { id: 2, name: '陈翠花', age: 13 }
      // ]
      // 这个插件需要的不是key:value声明的对象,
      // 只需要按照顺序给出的 value 值组成数组即可
      // const data = [
      //   [1, '王大锤', 12],
      //   [2, '陈翠花', 13]
      // ]

      // import('@/vendor/Export2Excel').then(excel => {
      //   excel.export_json_to_excel({
      //     // 配置对象
      //     header,
      //     data
      //   })
      // })
    },
    objToArray(userObj, dict) {
      // dict = {
      //   姓名: 'username'
      // }
      // userObj = {
      //   username:'tom'
      // }
      // // 根据headers 的顺序形成数组
      // userArray = ['tom']
      const header = Object.keys(dict)
      const userArray = []

      header.forEach(cnKey => {
        const enKey = dict[cnKey]
        // console.log(enKey)
        let value = userObj[enKey]
        // 之前转换数据直接推
        // 其实有例外情况如时间数据和聘用形式
        if (enKey === 'timeOfEntry' || enKey === 'correctionTime') {
          // 时间处理
          // 这个函数会将时间格式转成 yyyy-MM-dd
          // 这个结果是一个字符串
          // excel本身并不会将它所谓时间处理
          // 可以在外面包裹一层 new Date 转成时间对象
          value = new Date(formatDate(value))
        }
        if (enKey === 'formOfEmployment') {
          // 聘用形式处理
          // 聘用形式是 1 / 2 / 没有
          const obj = EmployeeEnum.hireType.find(item => item.id === value)
          value = obj ? obj.value : '未知'
        }
        // console.log(value)
        userArray.push(value)
      })
      // for (const cnKey of header) {
      //   // 第一个得到姓名
      //   // 需要做的是, 从 userObj 里面找到姓名对应的值
      //   // 但是userObj里面只有英文key, 先用字典转换
      //   const enKey = dict[cnKey]
      //   console.log(enKey)
      //   const value = userObj[enKey]
      //   console.log(value)
      //   userArray.push(value)
      // }
      console.log(userObj)
      console.log(userArray)
      return userArray
    }
  }
}
</script>
<style lang="scss" scoped>
.avatar {
  width:100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

</style>
