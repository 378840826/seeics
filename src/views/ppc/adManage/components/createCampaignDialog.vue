<template>
  <el-dialog
    title="新增广告活动"
    :visible.sync="dialogVisible"
    :append-to-body="true"
    :close-on-press-escape="false"
    top="1vh"
    width="800px">
    <div>
      <h3>▌广告活动</h3>
    </div>
    <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </span>
    </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: true
    };
  },
  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(() => {
          done();
        })
        .catch(() => {});
    }
  },
};
</script>
