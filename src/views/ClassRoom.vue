<template>
  <el-main>
    <div>
      <el-row class="btns">
        <el-input v-model="input" style="width: 200px;margin-right: 20px" placeholder="请输入关键字" clearable>
        </el-input>
        <el-button type="primary" icon="el-icon-search" @click="search(input)">搜索</el-button>
        <el-button type="primary" icon="el-icon-plus" @click="addDialogVisible = true" round>添加教室</el-button>
        <el-button type="danger" icon="el-icon-minus" round @click="dels()">批量删除</el-button>
      </el-row>
    </div>
    <el-table :data="roomList" border style="width: 100%"  max-height="400"
              show-summary>
      <el-table-column type="selection" width="55"></el-table-column><!--复选框-->
      <el-table-column prop="id" label="ID" width="140">
      </el-table-column>
      <el-table-column prop="classnum" label="教室" width="120">
      </el-table-column>
      <el-table-column prop="yn" label="是否为空" width="120">
      </el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <!--<el-button size="mini" @click="handleEdit()" class="btu">借用</el-button>-->
          <el-button type="primary" @click="borrow(scope.$index,scope.row)"
                     :disabled="scope.row.yn == '否'">借 用</el-button>
        </template>
        <!--scope.$index取到所有数据 scope.row表示当前行-->
      </el-table-column>
    </el-table>
    <div class="block">
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[3, 5, 7, 10]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total=totalCount>
        </el-pagination>
      </div>
      <el-dialog title="添加教室" :visible.sync="addDialogVisible" width="50%">
        <add-course></add-course>
      </el-dialog>
      <el-dialog title="修改教室" :visible.sync="editDialogVisible" width="50%">
        <edit-course ref="edit"></edit-course>
      </el-dialog>
    </div>
  </el-main>
</template>

<script>
// import * as qs from 'qs'

export default {
  name: 'ClassRoom',
  data () {
    return {
      // id: '',
      roomList: [],
      input: '',
      checked: true,
      addDialogVisible: false,
      editDialogVisible: false,
      ids: '',
      pageSize: 3,
      totalCount: 0,
      currentPage: 1,
      currentPage2: 5,
      currentPage3: 5,
      currentPage4: 4
    }
  },
  created () {
    this.getList(this.input, this.currentPage, this.pageSize)
    this.getRoomListCount()
  },
  methods: {
    borrow (index, row) {
      this.$axios.post(
        'http://localhost:8081/updateYn',
        this.$qs.stringify({
          id: row.id,
          yn: '否'
        }
          // this.$axios({
          //   method: 'post',
          //   url: 'http://localhost:8081/updateYn',
          //   data: {
          //     yn: '否',
          //     id: this.roomList.id
          //   },
          //   transformRequest: [function (data) {
          //     return qs.stringify(data)
          //   }]
          // }
        )).then(d => {
        if (d.data.code === 0) {
          // 关闭dialog 刷新父页面 element dialog 是自动关闭的 是因为父页面的 addDialogVisible 重置为false
          parent.location.reload()
        } else {
          this.$message(d.data.msg)
        }
      })
      console.log('>>>>>>>>')
    },
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pageSize = val
      // console.log('this.pageSize>>>' + this.pageSize)
      this.getList(this.input, this.currentPage, this.pageSize)
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.currentPage = val
      // console.log('this.currentPage>>>' + this.currentPage)
      this.getList(this.input, this.currentPage, this.pageSize)
    },
    getList (classnum, currentPage, pageSize) {
      this.$axios.post('http://localhost:8081/selectClassRoom',
        this.$qs.stringify({
          classnum: classnum,
          currentPage: currentPage,
          pageSize: pageSize
        })).then(d => {
        if (d.data.code === 0) {
          for (let i = 0; i < d.data.data.length; i++) {
            this.roomList.push({
              id: d.data.data[i].id,
              classnum: d.data.data[i].classnum,
              yn: d.data.data[i].yn
            })
          }
        } else if (d.body.code === -1) {
          this.roomList = []
        }
      })
    },
    getRoomListCount () {
      this.$axios.get('http://localhost:8081/selectClassRoomCount',
        this.$qs.stringify({
          classnum: this.input
        })).then(d => {
        if (d.data.code === 0) {
          this.totalCount = d.data.result
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
