<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 靠右的按钮 -->
      <page-tools>
        <template v-slot:after>
          <el-button type="primary" size="small">添加权限</el-button>
        </template>
      </page-tools>
      <!-- 表格 -->
      <el-table :data="list" border="" row-key="id">
        <el-table-column label="名称" prop="name" />
        <el-table-column label="标识" prop="code" />
        <el-table-column label="描述" prop="description" />
        <el-table-column label="操作">
          <template slot-scope="{ row }">
            <el-button v-if="row.type === 1" type="text" @click="addPermission(row.id, 2)">添加</el-button>
            <el-button type="text" @click="editPermission(row.id)">编辑</el-button>
            <el-button type="text" @click="delPermission(row.id)"> 删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 以下是编辑和添加权限点的弹窗 -->
      <el-dialog :title="`${showText}权限点`" :visible="showDialog" @close="btnCancel">
        <!-- 表单 -->
        <el-form ref="perForm" :model="formData" :rules="rules" label-width="120px">
          <el-form-item label="权限名称" prop="name">
            <el-input v-model="formData.name" style="width:90%" />
          </el-form-item>
          <el-form-item label="权限标识" prop="code">
            <el-input v-model="formData.code" style="width:90%" />
          </el-form-item>
          <el-form-item label="权限描述">
            <el-input v-model="formData.description" style="width:90%" />
          </el-form-item>
          <!-- 第四个属性, 权限点是否激活 -->
          <el-form-item label="开启">
            <el-switch
              v-model="formData.enVisible"
              active-value="1"
              inactive-value="0"
            />
          </el-form-item>
        </el-form>
        <el-row slot="footer" type="flex" justify="center">
          <el-col :span="6">
            <el-button size="small" type="primary" @click="btnOK">确定</el-button>
            <el-button size="small" @click="btnCancel">取消</el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getPermissionList } from '@/api/permisson'
import { tranListToTreeData } from '@/utils'
export default {
  data() {
    return {
      list: [],
      showDialog: true,
      formData: {
        name: '',
        code: '',
        description: '',
        enVisible: ''
      },
      rules: {
        name: [
          { required: true, trigger: 'blur', message: '权限名不能为空' }
        ],
        code: [
          { required: true, trigger: 'blur', message: '权限标识不能为空' }
        ]
      }
    }
  },
  computed: {
    showText() {
      return this.formData.id ? '编辑' : '新增'
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    async getPermissionList() {
      const data = await getPermissionList()
      // 需要将这个数据转换为树形结构
      // 注意当前权限列表接口, 对于没有上一层的顶级数据
      // pid 默认是 "0" 跟组织架构稍有不同
      this.list = tranListToTreeData(data, '0')
    },
    btnOK() {},
    btnCancel() {}
  }
}
</script>

<style>

</style>
