<template>
  <div>
    <!-- <div style="width: 30%;height: 500px;float: left;">
      <el-card class="box-card" style="width: 400px">
        <div style="margin-left: 130px;margin-top: 50px">
          <a-avatar :size="80" :src="circleUrl"   >
          </a-avatar>
        </div>
        <div style="margin-top: 50px">
          <el-descriptions title="用户信息"  :content-style="contextStyle" :label-style="labelStyle" :column="1" >
            <el-descriptions-item label="昵称"  >{{ user.nickname}}</el-descriptions-item>
            <el-descriptions-item label="用户名"  >{{ user.username}}</el-descriptions-item>
            <el-descriptions-item label="uid"  >{{ user.uid}}</el-descriptions-item>
          </el-descriptions>
        </div>
        <br><br><br><br>
      </el-card>
    </div> -->
    <!-- style="float: left;width: 70%" -->
    <div >
      <el-row :gutter="24">
        <el-col :span="7" :offset="1"><div ><el-card class="box-card">
          <div>用户总数</div>
          <div style="text-align: center;padding-top: 20px;font-weight: bold">{{userNum}}</div>
        </el-card>
        </div></el-col>
        <el-col :span="7"><div ><el-card class="box-card">
          <div>帖子总数</div>
          <div style="text-align: center;padding-top: 20px;font-weight: bold">{{postNum}}</div>
        </el-card>
        </div></el-col>
        <el-col :span="7"><div ><el-card class="box-card">
          <div>回复总数</div>
          <div style="text-align: center;padding-top: 20px;font-weight: bold">{{commentNum}}</div>
        </el-card>
        </div></el-col>
      </el-row>
    </div>
    <div style="float: left;width: 70%;margin-top: 100px;position: relative">
      <el-row :gutter="20">
        <el-col  :span="5" ><div id="bar" style="width: 400px;height: 400px"></div></el-col>
        <el-col  :span="5" :offset="4"><div id="pie" style="width: 400px;height: 400px"></div></el-col>
        <el-col  :span="5" :offset="5"><div id="pieSex" style="width: 400px;height: 400px"></div></el-col>
      </el-row>
    </div>

  </div>
</template>

<script>

import * as echarts from 'echarts';

export default {
  name: "Home",
  data(){
    return{
      circleUrl:'',
      userNum:'',
      postNum:'',
      commentNum:'',
      sex:'',
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},
      contextStyle:{
        "font-size":"20px",
        "padding-top":"10px"
      },
      labelStyle:{
        "font-size":"20px",
        "padding-top":"10px"
      }
    }
  },
  mounted() {
    this.circleUrl = this.user.avatar
    this.request.get('/echarts/comment').then(res =>{
      this.commentNum = res.data;
    })

    var chartDom = document.getElementById('bar')
    var myChart = echarts.init(chartDom)
    var option = {
      title: {
        text: '各季度用户数量',
        /*subtext: 'Fake Data',*/
        left: 'center'
      },
      xAxis: {
        type: 'category',
            data: ['第一季度', '第二季度', '第三季度', '第四季度']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [],
          type: 'bar'
        }
      ]
    }
    this.request.get('/echarts/user').then(res =>{
      let data = res.data.num;
      this.sex = res.data.sex
      this.userNum = data[0]+data[1]+data[2]+data[3]
      option.series[0].data = data
      myChart.setOption(option);
      pieSexOption.series[0].data = [
        {name:'男', value:this.sex[0]},
        {name:'女', value:this.sex[1]},
        {name:'保密', value:this.sex[2]},
    ]
    pieSexChart.setOption(pieSexOption)
    })

    var pieChartDom = document.getElementById('pie');
    var pieChart = echarts.init(pieChartDom);
    var pieOption =  {
      title: {
        text: '各季度帖子数量',
        /*subtext: 'Fake Data',*/
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        top: 'bottom',
        left: 'center'
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '40',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: [
          ]
        }
      ]
    };
    this.request.get('/echarts/post').then(res => {
      this.postNum = res.data[0]+res.data[1]+res.data[2]+res.data[3]
      pieOption.series[0].data = [
        {name:'第一季度', value:res.data[0]},
        {name:'第二季度', value:res.data[1]},
        {name:'第三季度', value:res.data[2]},
        {name:'第四季度', value:res.data[3]},
      ]
      pieChart.setOption(pieOption);
    })
    
    var pieSexChartDom = document.getElementById('pieSex');
    var pieSexChart = echarts.init(pieSexChartDom);
    var pieSexOption =  {
      title: {
        text: '用户性别',
        /*subtext: 'Fake Data',*/
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        top: 'bottom',
        left: 'center'
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '40',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: [
          ]
        }
      ]
    };
  }

}
</script>
<style scoped>

</style>