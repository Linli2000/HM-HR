<template>
  <div class="dashboard-container">
    <div class="app-container">
      <template>
        <div class="dashboard-container">
          <div class="app-container">
            <el-card>
              <el-tabs>
                <!-- 放置页签 -->
                <el-tab-pane label="角色管理">
                  <!-- 新增角色按钮 -->
                  <el-row style="height:60px">
                    <el-button
                      icon="el-icon-plus"
                      size="small"
                      type="primary"
                      @click="showDialog = true"
                    >新增角色</el-button>
                  </el-row>
                  <!-- 表格 -->
                  <el-table border="" :data="list">
                    <!-- type="index"索引 从1开始 也可以作用域插槽  <template slot-scope="scope">
                        {{ scope.$index +1 }}
                      </template>-->
                    <el-table-column label="序号" width="120" type="index" />
                    <el-table-column label="角色名称" width="240" prop="name" />
                    <el-table-column label="描述" prop="description" />
                    <el-table-column label="操作">
                      <template slot-scope="scope">
                        <el-button size="small" type="success">分配权限</el-button>
                        <el-button size="small" type="primary" @click="editRole(scope.row.id)">编辑</el-button>
                        <el-button size="small" type="danger" @click="deleteRole(scope.row.id)">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <!-- 分页组件 -->
                  <el-row type="flex" justify="center" align="middle" style="height: 60px">
                    <!-- 分页组件 -->
                    <el-pagination :page-size="page.pagesize" :page-sizes="[2,5,10,20]" layout="total,sizes,prev,pager,next,jumper" :total="page.total" @current-change="currentChange" @size-change="sizeChange" />
                  </el-row>
                </el-tab-pane>
                <el-tab-pane label="公司信息">
                  <el-alert
                    title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
                    type="info"
                    show-icon
                    :closable="false"
                  />
                  <el-form label-width="120px" style="margin-top:50px">
                    <el-form-item label="公司名称">
                      <el-input v-model="formData.name" disabled style="width:400px" />
                    </el-form-item>
                    <el-form-item label="公司地址">
                      <el-input v-model="formData.companyAddress" disabled style="width:400px" />
                    </el-form-item>
                    <el-form-item label="邮箱">
                      <el-input v-model="formData.mailbox" disabled style="width:400px" />
                    </el-form-item>
                    <el-form-item label="备注">
                      <el-input v-model="formData.remarks" type="textarea" :rows="3" disabled style="width:400px" />
                    </el-form-item>
                  </el-form>
                </el-tab-pane>
              </el-tabs>
            </el-card>
          </div>
        </div>
      </template>
      <el-dialog title="编辑弹层" :visible="showDialog" @close="btnCancel">
        <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="120px">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="roleForm.name" />
          </el-form-item>
          <el-form-item label="角色描述" prop="description">
            <el-input v-model="roleForm.description" />
          </el-form-item>
        </el-form>
        <!-- 底部 -->
        <el-row slot="footer" type="flex" justify="center">
          <el-col :span="6">
            <el-button size="small" @click="btnCancel">取消</el-button>
            <el-button size="small" type="primary" @click="btnOK">确定</el-button>
          </el-col>
        </el-row>
      </el-dialog>

    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getCompanyInfo, getRoleList, deleteRole, getRoleDetail, updateRole, addRole } from '@/api/setting'

export default {
  data() {
    return {
      // 弹窗部分数据
      showDialog: false,
      roleForm: {
        name: '',
        description: ''
      },
      rules: {
        name: [
          { required: true, message: '角色名不能为空', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '角色描述不能为空', trigger: 'blur' }
        ]
      },
      formData: {
        // name: '',
        // companyAddress: '',
        // mailbox: '',
        // remarks: ''
      },
      // 员工列表
      list: [],
      // 分页组件
      page: {
        pagesize: 5, // 每页显示的默认数据
        page: 1, // 当前显示第几页
        total: 0 // 总页数
      }
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  created() {
    // console.log(11)
    // 调用封装好的公司列表函数
    this.getCompanyInfo()
    // 获取员工列表
    this.getRoleList()
  },
  methods: {
    // 获取的公司的信息
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.companyId)
    },
    // 获取员工信息
    async getRoleList() {
      const { rows, total } = await getRoleList(this.page)
      this.list = rows
      this.page.total = total
      // console.log(this.list)
    },
    // 当前显示第几页
    currentChange(newPage) {
      // console.log(11)
      // 1. 设定当前最新的请求数据(页码)
      this.page.page = newPage
      // 2. 重新发请求
      this.getRoleList()
    },
    // 每页显示多少条数据 下拉框那里 ()括号
    sizeChange(newSize) {
      // console.log(22)
      this.page.pagesize = newSize
      this.getRoleList()
    },
    // deleteRole删除角色方法
    async deleteRole(id) {
      try {
        // 如果删除之前发现
        // 当前页只剩下一条数据 而且还不是第一页 就加载数据的时候向前翻一页
        // 因为list只会拿到当前页码发送的数据并不会拿到所有的数据 拿到第几页有几条 他只会根据这个
        if (this.list.length === 1 && this.page.page > 1) {
          this.page.page -= 1
        }
        await deleteRole(id) // 调用删除接口
        this.getRoleList() // 重新加载员工信息数据
      } catch (error) {
        console.log(error)
      }
    },
    // 弹框的确定
    async btnOK() {
      // 点击弹框的确认时触发
      // 校验表单
      // 只有校验通过的情况下 才会执行await的下方内容
      // roleForm这个对象有id就是编辑 没有id就是新增
      await this.$refs.roleForm.validate()
      if (this.roleForm.id) {
        // 发送数据 修改角色 发送请求 带着新的后台需要的数据
        await updateRole(this.roleForm)
      } else {
        // 新增业务
        await addRole(this.roleForm)
      }
      // 3. 重新加载数据, 关闭弹窗
      this.getRoleList()
      this.showDialog = false
      this.$message.success('修改成功')
    },
    // 弹框的取消
    btnCancel() {
      // 1. 清理数据恢复数据对象
      this.roleForm = {
        name: '',
        description: ''
      }
      // 2. 清理form校验错误提醒
      this.$refs.roleForm.resetFields()
      // 3. 关闭弹窗
      this.showDialog = false
    },
    // editRole编辑功能
    async editRole(id) {
      // console.log(111)
      // 发送api请求获取表单数据 获取原始的角色详情
      this.roleForm = await getRoleDetail(id)
      // console.log(this.roleForm)
      this.showDialog = true
    }
  }
}
</script>

<style>

</style>
