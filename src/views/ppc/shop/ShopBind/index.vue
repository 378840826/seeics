<!-- 店铺绑定 -->
<template>
  <div>
    <div class="explain">
      <div>1. 点击去授权后，将跳转到亚马逊。为
        <span class="warn">防止店铺关联</span>，请在
        <span class="warn">常用环境</span>下操作
      </div>
      <div>2. 授权成功后，您可以在其他任何地⽅登录系统查看店铺数据</div>
    </div>
    <div class="form-container">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="店铺名称" prop="storeName">
          <el-input clearable v-model="form.storeName" placeholder="用于卖家区分各店铺" />
        </el-form-item>
        <el-form-item label="地区站点" prop="marketplaces">
          <el-select
            multiple
            clearable
            v-model="form.marketplaces"
            placeholder="请选择地区站点"
            style="width: 100%"
            :disabled="!!shopData.storeName"
          >
            <el-option-group
              v-for="group in marketplacesOptions"
              :key="group.label"
              :label="group.label"
            >
              <el-option
                v-for="item in group.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-option-group>
          </el-select>
        </el-form-item>

        <el-form-item class="btns">
          <el-button
            type="primary"
            @click="handleBind"
            :disabled="isDisabledBindBtn"
          >
            {{ shopData.storeName ? '去更新授权' : '去授权' }}
          </el-button>
          <el-button
            v-if="!!shopData.storeName"
            @click="handleOk"
            type="primary"
            plain
            :disabled="isDisabledOkBtn"
          >确定修改</el-button>
          <el-button @click="onClose()">取 消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { marketplacesOptions, marketplacesRegion, getOAuthUrl } from '../utils';

export default {
  name: 'ShopBind',

  props: {
    // 点击编辑按钮打开的授权弹窗
    editShopData: {
      type: Object,
    },
    onClose: {
      type: Function,
      required: true,
    },
    onOk: {
      type: Function,
      required: true,
    },
  },

  // mounted() {
  //   console.log('this', this.shopData);
  //   console.log('marketplacesRegion', marketplacesRegion);
  // },

  data() {
    return {
      marketplacesOptions,
      form: {
        storeName: this.editShopData.storeName || '',
        marketplaces: [this.editShopData.marketplace || 'US'],
      },
      region: marketplacesRegion[this.editShopData.marketplace] || 'NorthAmerica',
    };
  },

  computed: {
    shopData() {
      return this.editShopData || {};
    },

    // 输入规则
    rules() {
      return {
        storeName: [
          { required: true, message: '请输店铺名称（长度在 1 到 20 个字符）', trigger: 'blur' },
          { min: 1, max: 20, message: '店铺名称长度在 1 到 20 个字符', trigger: 'blur' },
          {
            validator: (_, value, callback) => {
              const storeName = value.trim();
              if (storeName === '') {
                callback(new Error('请输店铺名称（长度在 1 到 20 个字符）'));
              } else {
                callback();
              }
            },
            trigger: 'blur',
          },
        ],
        marketplaces: [
          { required: true, message: '请选择地区站点', trigger: 'blur' },
        ],
      };
    },

    // 确定按钮是否禁用
    isDisabledOkBtn() {
      return !this.form.storeName.trim() || (this.form.storeName === this.shopData.storeName);
    },

    // 去授权按钮是否禁用
    isDisabledBindBtn() {
      return !this.form.storeName.trim() || !this.form.marketplaces.length;
    },
  },

  methods: {
    // 判断店铺名称是否重复(相同站点下不能重复)
    judgeNameExist(name, marketplaces) {
      const shopList = this.$store.state.shop.list;
      // 筛选出需要进行判断的店铺
      const shops = {};
      marketplaces.forEach(marketplace => shops[marketplace] = []);
      shopList.forEach(shop => {
        if (shops[shop.marketplace]) {
          shops[shop.marketplace].push(shop);
        }
      }); 
      // 相同站点下只要有一个重复，就是返回重复
      for (const key in shops) {
        const arr = shops[key];
        const shop = arr.find(shop => shop.storeName === name);
        if (shop) {
          return true;
        }
      }
      return false;
    },

    // 开始店铺授权
    handleBind() {
      // 是”去授权“时，判断店铺名称是否有重复
      if (!this.shopData.storeName) {
        const isNameExist = this.judgeNameExist(this.form.storeName.trim(), this.form.marketplaces);
        if (isNameExist) {
          this.$message({
            type: 'error',
            message: '店铺名称已存在',
          });
          return;
        }
      }
      this.onOk && this.onOk();
      // 卖家中心url
      const url = getOAuthUrl(
        this.form.marketplaces[0],
        {
          storeName: this.form.storeName.trim(),
          marketplaces: this.form.marketplaces,
        },
      );
      console.log('url', url);
      window.open(url);
    },

    // 确定修改店铺名称
    handleOk() {
      this.onOk && this.onOk();
      this.$store.dispatch('updateName', {
        ...this.shopData,
        storeName: this.form.storeName,
      }).then(res => {
        this.$message({
          type: 'success',
          message: res.data.msg || '操作成功',
        });
      });
    },
  },

  watch: {
    'form.marketplaces'(newArr, oldArr) {
      // 不可选择不同地区的站点
      const isAdd = newArr.length > oldArr.length;
      if (isAdd) {
        // 本次添加的站点
        const newMarketplaces = newArr[newArr.length - 1];
        // 已选的站点的所属地区
        const oldRegion = marketplacesRegion[oldArr[0]];
        // 本次添加站点的所属地区
        const newRegion = marketplacesRegion[newMarketplaces];
        if (newRegion !== oldRegion) {
          // 如果添加了不同地区的站点，清除旧的站点
          this.form.marketplaces = [newMarketplaces];
        }
        // 设置地区
        this.region = newRegion;
      }
    },

    editShopData(data) {
      this.form = {
        storeName: data.storeName || '',
        marketplaces: [data.marketplace || 'US'],
      };
    }
  },
};
</script>

<style lang="scss" scoped>
  @import "./index.scss";
</style>