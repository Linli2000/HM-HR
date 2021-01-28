<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <!-- 放置页签 -->
          <el-tab-pane label="角色管理">
            <!-- 新增角色按钮 -->
            <el-row style="height: 60px">
              <el-button
                icon="el-icon-plus"
                size="small"
                type="primary"
                @click="showDialog = true"
              >新增角色</el-button>
            </el-row>
            <!-- 表格 -->
            <el-table border="" :data="list">
              <el-table-column label="序号" width="120" type="index" />
              <el-table-column label="角色名称" width="240" prop="name" />
              <el-table-column label="描述" prop="description" />
              <el-table-column label="操作">
                <template slot-scope="{row}">
                  <!-- scope.row -->
                  <el-button size="small" type="success" @click="assignPerm(row.id)">分配权限</el-button>
                  <el-button size="small" type="primary" @click="editRole(row.id)">编辑</el-button>
                  <el-button size="small" type="danger" @click="deleteRole(row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <el-row
              type="flex"
              justify="center"
              align="middle"
              style="height: 60px"
            >
              <!-- 分页组件 -->
              <el-pagination
                :page-size="page.pagesize"
                :page-sizes="[2, 5, 10, 20]"
                layout="total,sizes,prev,pager,next,jumper"
                :total="page.total"
                @current-change="currentChange"
                @size-change="sizeChange"
              />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <el-form label-width="120px" style="margin-top: 50px">
              <el-form-item label="公司名称">
                <el-input
                  v-model="formData.name"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input
                  v-model="formData.companyAddress"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input
                  v-model="formData.mailbox"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="备注">
                <el-input
                  v-model="formData.remarks"
                  type="textarea"
                  :rows="3"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
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

    <el-dialog title="分配权限" :visible="showPermDialog" @close="btnPermCancel">
      <!-- 权限是一颗树 -->
      <!-- 将数据绑定到组件上 -->
      <!-- check-strictly 如果为true 那表示父子勾选时  不互相关联 如果为false就互相关联 -->
      <!-- id作为唯一标识 -->
      <!-- <el-tree
        ref="permTree"
        :data="permData"
        :props="defaultProps"
        :show-checkbox="true"
        :check-strictly="true"
        :default-expand-all="true"
        :default-checked-keys="selectCheck"
        node-key="id"
      /> -->
      <!-- 确定 取消 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button type="primary" size="small" @click="btnPermOK">确定</el-button>
          <el-button size="small" @click="btnPermCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getCompanyInfo, getRoleList, deleteRole, getRoleDetail, updateRole, addRole } from '@/api/setting'
import { getPermissionList } from '@/api/permission'
import { tranListToTreeData } from '@/utils'
export default {
  data() {
    return {
      // 弹窗部分数据
      showDialog: false,
      showPermDialog: false,
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

      // 存放员工数组
      list: [],
      // 存放公司信息
      formData: {
        name: 'dfadsf',
        companyAddress: 'dsfdsfads',
        mailbox: 'dsfsdaf',
        remarks: 'dsfdsf'
      },
      // 创建一个专门用来管理翻页的对象
      page: {
        pagesize: 2,
        page: 1,
        total: 0
      },

      permData: []
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  created() {
    this.getRoleList()
    this.getCompanyInfo()
  },
  methods: {
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.companyId)
    },
    async getRoleList() {
      const { rows, total } = await getRoleList(this.page)
      this.list = rows

      this.page.total = total
      // 建议用下面的方法来改对象
      // 好处在于每次修改其实都是创建一个新对象
      // this.page = {
      //   ...this.page,
      //   total
      // }

      console.log(this.list)
    },
    currentChange(newPage) {
      // 1. 设定当前最新的请求数据(页码)
      this.page.page = newPage
      // 2. 重新发请求
      this.getRoleList()
    },
    sizeChange(newSize) {
      this.page.pagesize = newSize
      this.getRoleList()
    },
    async deleteRole(id) {
      try {
        // 可以考虑的优化
        // 如果删除之前发现
        // 当前页面剩下只有一条数据, 而且当前不是第一页
        // 那么加载数据的时候往前翻一页
        if (this.list.length === 1 && this.page.page > 1) {
          this.page.page -= 1
        }

        // 1. 发送请求
        await deleteRole(id)
        // 2. 重新获取角色数据
        this.getRoleList()

        this.$message.success('删除成功')
      } catch (error) {
        console.log(error)
      }
    },
    async editRole(id) {
      // 1.发送 api 请求获取表单数据
      this.roleForm = await getRoleDetail(id)
      this.showDialog = true
    },
    async btnOK() {
      // 点击确认时触发
      // 1. 校验表单
      await this.$refs.roleForm.validate()

      // 2. 发送数据
      // 发送时需要区分到底是编辑还是新增, 根据不同状况,发送不同 api 请求
      if (this.roleForm.id) {
        // 编辑
        await updateRole(this.roleForm)
      } else {
        // 新增
        await addRole(this.roleForm)
      }

      // 3. 后续处理(重新加载数据, 关闭弹窗)
      this.getRoleList()
      this.showDialog = false

      this.$message.success('操作成功')
    },
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

    async assignPerm(id) {
      // 1. 回显数据
      // 1.1 回显全部的权限数据
      // 获取后需要转换成树形数据
      // 这个转换函数需要传入两个参数
      //  1. 原数组(平铺并列)
      //  2. 默认遍历源头(没有任何上一层的状态, 对于权限来说, '0')
      const data = await getPermissionList()
      this.permData = tranListToTreeData(data, '0')
      console.log(data)
      console.log(this.permData)
      // 1.2 回显当前角色的权限
      // 2. 弹出弹窗
      this.showPermDialog = true
    },
    btnPermOK() {},
    btnPermCancel() {}
  }
}
</script>

<style>
</style>