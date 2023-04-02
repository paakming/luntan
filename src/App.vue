<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style>
  #app{
    height: 100%;
  }
  .el-table .warning-row {
    background: oldlace;
  }
  .el-table .danger-row {
    background: rgb(255, 245, 245);
  }
  .el-table .success-row {
    background: #f0f9eb;
  }
</style>
