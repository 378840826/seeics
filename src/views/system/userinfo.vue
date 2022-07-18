<template>
  <div>
    <basic-container>
      <avue-form :option="option"
                 v-model="form"
                 @tab-click="handleTabClick"
                 @submit="handleSubmit"
                 ></avue-form>
    </basic-container>
  </div>
</template>

<script>
import getOption from '@/option/user/info';
import { getUserInfo, updateInfo, updatePassword } from '@/api/system/user';
import md5 from 'js-md5';
import func from '@/util/func';
import { activationData } from '@/api/user';

export default {
  data() {
    return {
      index: 0,
      isPay: 0,
      form: {},
    };
  },
  computed: {
    option() {
      return getOption(this.isPay);
    },
  },
  created() {
    this.handleWitch();
    activationData();
  },
  methods: {
    handleSubmit(form, done) {
      if (this.index === 0) {
        const params = {
          user: { ...form },
          deptName: form.deptName,
          fullName: form.fullName,
        };
        updateInfo(params).then(res => {
          if (res.data.success) {
            this.$message({
              type: 'success',
              message: '修改信息成功!'
            });
          } else {
            this.$message({
              type: 'error',
              message: res.data.msg
            });
          }
          done();
        }, error => {
          window.console.log(error);
          done();
        });
      } else {
        updatePassword(md5(form.oldPassword), md5(form.newPassword), md5(form.newPassword1)).then(res => {
          if (res.data.success) {
            this.$message({
              type: 'success',
              message: '修改密码成功!'
            });
          } else {
            this.$message({
              type: 'error',
              message: res.data.msg
            });
          }
          done();
        }, error => {
          window.console.log(error);
          done();
        });
      }
    },
    handleWitch() {
      if (this.index === 0) {
        getUserInfo().then(res => {
          const user = res.data.data;
          this.isPay = user.isPay;
          this.form = {
            id: user.id,
            avatar: user.avatar,
            name: user.name,
            realName: user.realName,
            phone: user.phone,
            email: user.email,
            deptName: user.deptName,
            fullName: user.fullName,
          };
        });
      }
    },
    handleTabClick(tabs) {
      this.index = func.toInt(tabs.index);
      this.handleWitch();
    }
  }
};
</script>

<style>
</style>
