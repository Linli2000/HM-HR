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
                    >新增角色</el-button>
                  </el-row>
                  <!-- 表格 -->
                  <el-table border="">
                    <el-table-column label="序号" width="120" />
                    <el-table-column label="角色名称" width="240" />
                    <el-table-column label="描述" />
                    <el-table-column label="操作">
                      <el-button size="small" type="success">分配权限</el-button>
                      <el-button size="small" type="primary">编辑</el-button>
                      <el-button size="small" type="danger">删除</el-button>
                    </el-table-column>
                  </el-table>
                  <!-- 分页组件 -->
                  <el-row type="flex" justify="center" align="middle" style="height: 60px">
                    <!-- 分页组件 -->
                    <el-pagination layout="prev,pager,next" />
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
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getCompanyInfo, getRoleList } from '@/api/setting'

export default {
  data() {
    return {
      formData: {
        // name: '',
        // companyAddress: '',
        // mailbox: '',
        // remarks: ''
      },
      list: []
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
      this.list = await getRoleList()
      console.log(this.list)
    }
  }
}
</script>

<style>

</style>
