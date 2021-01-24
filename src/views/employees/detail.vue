<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">

            <!-- 放置表单 -->
            <el-form ref="form" :model="userInfo" :rules="rules" label-width="120px" style="margin-left: 120px; margin-top:30px">
              <el-form-item label="姓名:" prop="username">
                <el-input v-model="userInfo.username" style="width:300px" />
              </el-form-item>
              <el-form-item label="密码:" prop="password2">
                <el-input v-model="userInfo.password2" style="width:300px" type="password" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveUser">更新</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <!-- 普通的写法 -->
            <!-- <UserInfo /> -->
            <!-- 还可以用一个通用的标签, component来显示动态的组件 -->
            <!-- 其中它的 is 属性用字符串的形式绑定要显示的组件名即可 -->
            <component :is="'UserInfo'" />
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
            <component :is="'JobInfo'" />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getUserDetailById } from '@/api/user'
import { saveUserDetailById } from '@/api/employees'
import UserInfo from './components/user-info'
import JobInfo from './components/job-info'
export default {
  components: {
    UserInfo,
    JobInfo
  },
  data() {
    return {
      userId: this.$route.params.id,
      userInfo: {
        username: '',
        // 这个地方是后台拿回来的加密数据, 没法使用
        password: '',
        // 另外创建一个变量, 来处理密码更新
        password2: ''
        // 之后发送时, 因为后台要求的字段名叫 password
        // 在发送前将 password = password2
      },
      rules: {
        username: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ],
        password2: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 9, message: '密码长度6-9位', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getUserDetailById()
  },
  methods: {
    async getUserDetailById() {
      this.userInfo = await getUserDetailById(this.userId)
    },
    async saveUser() {
      // 校验数据
      await this.$refs.form.validate()

      // 发送请求的时候, 将用户输入的 password2 放入 password 交给后台
      await saveUserDetailById({ ...this.userInfo, password: this.userInfo.password2 })
      // 提醒成功
      this.$message.success('更新成功')
    }
  }
}
</script>

<style>

</style>
