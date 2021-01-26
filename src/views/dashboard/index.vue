<template>
  <div>
    新年，即一年的第一天，为世界多数国家通行的节日。世界各国，特别是古代，新年都有不同的日期，现代世界多数国家定为公元制纪年的1月1日。现代中国将“元旦”称为公历新年，将“春节”称为农历新年。当日，人们会以各种不同的方式庆祝新年的到来。
    <button @click="handleClick">打印</button>

  </div>
</template>

<script>
export default {

  methods: {
    handleClick() {
      print()
    }
  }
}

</script>

<style>
@media print  {
    .sidebar-container,
    .navbar {
      display: none;
    }
    .main-container {
      margin-left: 0 !important;
      width: 100%;
    }
  }
</style>
