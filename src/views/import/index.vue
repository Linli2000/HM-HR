<template>
  <UploadExcel :on-success="onSuccess" />
</template>

<script>
export default {
  methods: {
    onSuccess(data) {
      console.log(data)
      // 这里可以得到数据包括 headers 表头 和 results 行数据
      // 其中行数据就是员工数据对象组成的数组, 不过key全部是中文
      // 需要转换成英文再发送给后端
      // 源数据大概是:
      // arr = [
      //   {
      //     姓名: 'tom'
      //   },
      //   {
      //     姓名: 'jerry'
      //   }
      // ]
      // // 希望得到:
      // arr = [
      //   {
      //     name: 'tom'
      //   },
      //   {
      //     name: 'jerry'
      //   }
      // ]
      // 1. 创建一个对象方便后面查找对应的英文表达(字典)
      const oldUserData = data.results
      const dict = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
        // cnKey:1111
      }

      // 2. 遍历员工数组拿到每一个员工对象转换成英文 key 输出新的结果数组
      const userData = oldUserData.map(user => {
        // 这里就应该对员工对象进行处理返回结果
        // user 就是对象
        // {
        //    姓名: 'tom'
        // },
        // 我需要做的就是遍历这个对象的每一个属性, 将 key 转换成 英文以后组成一个新对象返回
        // console.log(user)

        const newUser = {}
        for (const cnKey in user) {
          // console.log(cnKey)
          // console.log(user)
          // 遍历员工对象里面的每个属性
          // 1. 拿到英文key []拿到dict下面属性的每个值 .是拿单个特指的
          const enKey = dict[cnKey]
          // 2. 拿到对应 value 值
          const value = user[cnKey]
          // 就可以将对应的属性转换成 enKey: value 这样的结构
          newUser[enKey] = value
        }

        return newUser
      })

      console.log(userData)
    }
  }
}
</script>

<style>

</style>
