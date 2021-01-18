
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
import { getDepartments } from '@/api/departments'
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
    const checkNameRepeat = async(rule, value, callback) => {
      // 成功 直接调用 callback()
      // 失败 调用 callback(new Error('错误原因'))
      // 这里要校验当前输入名, 跟同一个父部门下的其他子部门没有重复
      // 1. 获取所有部门数据
      const res = await getDepartments()
      // 2. 遍历所有的部门, 如果有一个部门 pid 跟我当前需要添加的父部门相同 item.pid === treeNode.id
      // 3. 而且 item.name === value 就证明出错了

      // 本来拿回来的是所有部门, 可以先用筛选, 筛选出属于当前父部门的数据
      // 数组的过滤器可以实现, 过滤器的原理, 就是遍历所有的数据, 每个数据都执行一下回调
      // 如果回调返回 true 就保留, 否则抛弃
      // res.filter(item => item.pid === this.treeNode.id)
      // 然后在这个基础上, 判断是否有同名
      // 使用 some 方法, 可以判断一个数组当中, 是否存在某些元素符合规定
      // 如果符合则返回 true 否则返回 false
      const isRepeat = res.depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
      if (isRepeat) {
        callback(new Error('同一部门下, 不能有两个同名的子部门'))
      } else {
        callback()
      }
    }
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
          { min: 1, max: 50, trigger: 'blur', message: '部门名称要求1到50个字符' },
          { trigger: 'blur', validator: checkNameRepeat }
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
