<template>
  <div class="index-container">    
    <div class="top-container">
      <div class="top-center">
        <div class="left-text">
          <img src="/img/bg/logoseeics.png">
          <div class="title">找数据，上思意</div>
          <div class="subtitle">亚马逊创业者的数据神器</div>
          <el-button type="primary" @click="tokeywordindex">立即免费体验</el-button>
        </div>
        <img src="/img/bg/indexbg.png">
      </div>
    </div>
    <div class="center-container">
      <div class="center-center">
        <el-form :inline="true" :model="formInline">
          <el-form-item>
            <el-select v-model="formInline.site" class="siteselect">
              <el-option label="美国" value="US"></el-option>
              <el-option label="英国" value="EN" disabled></el-option>
              <el-option label="加拿大" value="CA" disabled></el-option>
              <el-option label="法国" value="FR" disabled></el-option>
              <el-option label="意大利" value="SP" disabled></el-option>
              <el-option label="德国" value="GE" disabled></el-option>
            </el-select>
          </el-form-item>
          <el-form-item >
            <el-input v-model="formInline.keyword" placeholder="请输入需要分析的关键词" class="keywordinput"></el-input>
          </el-form-item>       
          <el-form-item>
            <el-button type="primary" @click="tokeywordindex">分析</el-button>
          </el-form-item>
          <el-form-item label="亚马逊搜索结果前 ">
            <el-select v-model="formInline.page" class="pageselect">
              <el-option label="2" value=2></el-option>
              <el-option label="4" value=4 ></el-option>
              <el-option label="6" value=6 ></el-option>
              <el-option label="8" value=8 ></el-option>
              <el-option label="10" value=10 ></el-option>
            </el-select>
            <span>  页</span>
          </el-form-item>
        </el-form> 
        <div class="functionalSpecifications">
          <div class="functionaltitle">功 能 介 绍</div>
          <el-tabs v-model="activeName">
          <el-tab-pane label="销售大盘" name="first">
            <div class="Intelligentad">
              <div class="leftad">
                <div class="adtitle">销售大盘</div>
                <div class="adsubtitle">
                  <div>1、对接亚马逊官方接口，安全值得信赖；</div>
                  <div>2、多店铺数据全范围展示，您的江山一览无遗；</div>
                  <div>3、自动化报表，精准及时，从Excel中解放双手。</div>
                  <el-button type="primary" @click="tokeywordindex">立即免费体验</el-button>
                </div>  
              </div>
              <div class="rightimg">
                <img src="/img/indexmarketsales.png">
              </div>                        
            </div>        
          </el-tab-pane>
          <el-tab-pane label="ASIN动态" name="second">
            <div class="Intelligentad">
              <div class="leftad">
                <div class="adtitle">ASIN动态</div>
                <div class="adsubtitle">
                  <div>1、ASIN历史变化点滴全纪录，帮你轻松复盘；</div>
                  <div>2、变体拆分前后效果对比，拆合不再迷茫；</div>
                  <div>3、针对竞争对手调价，紧随市场脚步。</div>
                  <el-button type="primary" @click="tokeywordindex">立即免费体验</el-button>
                </div>  
              </div>
              <div class="rightimg">
                <img src="/img/indexasin.png">
              </div>
                              
            </div>      
          </el-tab-pane>
          <el-tab-pane label="智能调价" name="third">
          <div class="Intelligentad">
              <div class="leftad">
                <div class="adtitle">智能调价</div>
                <div class="adsubtitle">
                  <div>1、根据销售表现调价，自动智能可靠；</div>
                  <div>2、根据黄金购物车调价，跟卖不落下风；</div>
                  <div>3、针对竞争对手调价，紧随市场脚步</div>
                  <el-button type="primary" @click="tokeywordindex">立即免费体验</el-button>
                </div>  
              </div>
              <div class="rightimg">
                <img src="/img/indexsmartprice.png">            
              </div>                          
            </div>      
          </el-tab-pane>
          <el-tab-pane label="智能广告" name="fourth">
            <div class="Intelligentad">
              <div class="leftad">
                <div class="adtitle">智能广告</div>
                <div class="adsubtitle">
                  <div>1、强大的数据整合能力，图形化的友好界面；</div>
                  <div>2、自动化的广告管理，安全放心的成本控制，</div>
                  <div>3、由此出发，您的亚马逊广告营销将一路通畅</div>
                  <el-button type="primary" @click="tokeywordindex">立即免费体验</el-button>
                </div>  
              </div>
              <div class="rightimg">
                <img src="/img/intelligentad.png">            
              </div>                          
            </div>
          </el-tab-pane>
        </el-tabs>
        <div class="faq">
          <div class="faqtitle">FAQ</div>
          <div class="daqinstructions">
            <div class="leftdiv">
              <div class="smalltitle">思意是做什么的？</div>
              <div class="smallsubtitle">
                思意是为亚马逊卖家量身打造的亚马逊数据选品运营分析工具。使用思意，可以帮助您在亚马逊上洞悉市场趋势、监控各种数据、提升流量和了解运营效果，从而成功打造亚马逊上最火的商品。
              </div>
              <div class="smalltitle">支持哪些站点？</div>
              <div class="smallsubtitle">目前思意支持Amazon美国、加拿大、英国、法国、德国、意大利、西班牙、日本等8个站点，未来还会支持Amazon的更多站点</div>
              <div class="smalltitle">收费方式是怎样的？</div>
              <div class="smallsubtitle">思意采取多等级VIP会员模式，用户可以按需去选择，普通会员免费试用14天。</div>
            </div>          
            <div class="leftdiv">
              <div class="smalltitle">思意会窃取我的商品数据信息吗？</div>
              <div class="smallsubtitle">
                思意尊重并保护所有卖家的个人隐私权，会严格保证每一位用户数据的安全不被侵犯， 绝不会通过出卖或利用用户数据来进行直接或间接的牟利。 根据国家相关规定，私自泄露用户数据的行为将会受到法律严惩
              </div>
              <div class="smalltitle">使用会造成账号的关联吗？</div>
              <div class="smallsubtitle">不会的。思意通过Amazon官方提供SP-API接口获取数据和管理店铺，不存在账号关联的问题</div>
              <div class="smalltitle">有没有使用说明书？</div>
              <div class="smallsubtitle">有的，注册之后，请点击页面上的帮助按钮获取使用说明书。</div>
            </div>
          </div>
        </div>
        <div class="footerindex">
          <div class="privacynotice">
            <span class="firstspan">更新日志</span>
            <span @click="privacydialogVisible=true" style='cursor:pointer;'>Privacy Notice</span>
          </div>
          <div>技术支持： support@seeics.com</div>
          <div>Copyright 2017 - 2022 All Rights Reserved | Powered by seeics.com</div>
        </div>
        </div>
      </div>
    </div>
    <el-dialog title="隐私策略" :visible.sync="privacydialogVisible">
      <div class="privacydialog">
        <div>
          <h3>本隐私权政策部分将帮助您了解以下内容：</h3>
          <div>
            1.我们如何收集和使用您的个人信息
            <br/> 2.我们如何使用Cookie和同类技术
            <br/>3. 我们是否共享、转让、公开披露您的个人信息
            <br/>4. 我们如何保护您的个人信息
            <br/>5. 您如何管理您的个人信息
            <br/>6. 如何联系我们
          </div>
          <h3>1.我们如何收集和使用您的信息</h3>
            <div class="intervaltext">我们会出于本政策所述的以下目的，收集和使用您的个人信息：</div>
            <div class="title1">(1)帮助您成为我们的会员</div>
            <div>为成为我们的会员，以便我们为您提供会员服务，您需要提供电子邮箱地址， 并创建用户名和密码。如果您仅需使用浏览首页、功能介绍、FAQ等内容，您不需要注册成为我们的会员及提供上述信息</div>
            <div class="title1">(2)向您展示相关的产品和服务</div>
            <div>为通知您我们新推出的产品和服务，我们会收集您的邮箱等信息，如果您不想接受我们给您发送的提醒，您可随时退订相关邮件。</div>
            <div class="title1">(3)为向您提供相关的提醒服务</div>
            <div>为向您提供相关的提醒服务，我们会收集您的邮箱等信息，如果您不想接受我们给您发送的提醒，您可随时取消相应产品的提醒功能</div>
            <div class="title1">a.您向我们提供的信息</div>
            <div>您在注册过程中需要提供邮箱等信息。</div>
            <div class="title1">b.我们在您使用服务过程中收集的信息</div>
            <div>我们会根据您输入的搜索内容，向您提供更契合您需求的页面展示和搜索结果。
                当您使用我们网站的产品或服务时，我们会自动收集您对我们服务的详细使用情况，作为有关网络日志保存。 
                例如您的搜索查询内容、IP地址、浏览器的类型、电信运营商、使用的语言、访问日期和时间及您访问的网页记录等。绑定店铺的过程中，
                我们会收集您所有店铺的SellerID以及MWS Auth Token等信息， 用于后续向亚马逊请求店铺的相关数据，由于亚马逊的安全设定，
                与本站开发相关的MWS Auth Token仅可用于本网站的开发者访问亚马逊的数据接口，
                其他开发者无法通过Token访问接口从而获得您的店铺数据，但是为了安全起见， 请勿向其他开发者泄露MWS Auth Token。
                我们会收集您绑定的所有店铺的商品信息，用于向您展示及便于您对商品进行管理，包括商品标题、价格、发货方式、库存等。
                我们会收集您绑定的所有店铺的订单和广告等信息，用于向您展示相关的统计数据及便于您对订单和广告进行管理。
                以上信息均通过亚马逊官方提供的MWS数据接口进行定时获取和自动同步，您可以在亚马逊Seller Central后台取消授权，从而停止接口的所有数据访问。
                我们将信息用于本政策未载明的其他用途，或者将基于特定目的收集而来的信息用于其他目的时，会事先征求您的同意。
                如我们停止运营网站的产品或服务，我们将及时停止继续收集您个人信息的活动，将停止运营的通知以公告的形式通知您，对所持有的个人信息进行删除处理。
            </div>
        </div>
        <h3>2.我们如何使用 Cookie 和同类技术</h3>
        <div>
          为确保网站正常运转、为您获得更人性化的访问体验，我们会在您的计算机或移动设备上存储名为 Cookie 的小数据文件。 
          Cookie 通常包含标识符、站点名称以及一些号码和字符。借助于 Cookie，网站能够存储您的偏好和使用状态等数据。
        </div>
        <div>
          您可根据自己的偏好管理或删除 Cookie。 有关详情，请参见AboutCookies.org。 
          您可以清除计算机上保存的所有 Cookie，大部分网络浏览器都设有阻止 Cookie 的功能。
          但如果您这么做，则需要在每一次访问我们的网站时更改用户设置。 如需详细了解如何更改浏览器设置，请访问您使用的浏览器的相关设置页面。
        </div>
        <h3>3.我们是否共享、转让、公开披露您的个人信息</h3>
        <div>我们不会与其他公司、组织和个人共享、转让、公开披露您的个人信息。</div>
        <h3>4.您如何管理您的个人信息</h3>
        <div class="intervaltext">您可以通过以下方式访问及管理您的个人信息：</div>
        <div class="title1">(1)访问/修改您的个人信息</div>
        <div>如果您希望访问或编辑您的账户中的个人基本资料信息、更改您的密码等，您可以通过登录账号通过“个人中心”执行此类操作。</div>
        <div class="title1">(2)删除您的个人信息</div>
        <div>
        您可以通过注册邮箱联系我们，要求删除您的部分个人信息。在以下情形中，您可以向我们提出删除个人信息的请求:
        <br/>a.如果我们收集、使用您的个人信息，却未征得您的明确同意；
        <br/>b.如果我们处理个人信息的行为严重违反了与您的约定；
        <br/>c.如果您不再使用我们的产品或服务，或您主动注销了账号；
        <br/>d.如果我们永久不再为您提供产品或服务。
        </div>
        <div class="intervaltext">若我们决定响应您的删除请求，我们会发送最终确认邮件，您回复确认删除后，我们系统管理员会及时删除您的账号信息并邮件通知您删除结果。</div>
        <h3>5.我们如何保护您的个人信息</h3>
        <div>我们已采取符合业界标准、合理可行的安全防护措施保护您提供的个人信息安全，
              防止个人信息遭到未经授权访问、公开披露、使用、修改、损坏或丢失。 
              例如，我们会对网站提供HTTPS（Hyper Text Transfer Protocol over Secure Socket Layer）协议安全浏览方式；
              我们会使用加密技术提高个人信息的安全性；我们会使用受信赖的保护机制防止个人信息遭到恶意攻击；
        </div>
        <h3>6.本隐私权政策如何更新</h3>
        <div>我们的隐私权政策可能变更，本文顶部显示更新时间。</div>
        <h3>7.如何联系我们</h3>
        <div>如对本政策内容有任何疑问、意见或建议，您可通过管理员邮箱（ wailin08@qq.com ）或技术支持邮箱（ support@seeics.com ）与我们联系， 我们将在7天内回复您的请求</div>
        <div class="buttoncss">
          <el-button type="primary" @click="privacydialogVisible=false">OK,我了解了</el-button>
        </div>
        
      </div>

    </el-dialog>
  </div>
</template>

<script>
import { getQueryString, getTopUrl } from '@/util/util';
import { validatenull } from '@/util/validate';
export default {
  name: 'index',
  data(){
    return {
      activeName: 'first', //功能说明默认值
      privacydialogVisible: false, //隐私策略弹框 
      formInline: {
        site: '美国',
        keyword: '',
        page: '2'
      },
      socialForm: {
        tenantId: '000000',
        source: '',
        code: '',
        state: '',
      },
    };
  },
  created() {
    this.handleLogin();
  },
  watch: {
    $route() {
      this.handleLogin();
    }
  },
  methods: {
    tokeywordindex(){
      this.$router.push({ path: '/keyword/index' });
    },
    handleLogin() {
      const topUrl = getTopUrl();
      const redirectUrl = '/blade-auth/oauth/redirect/';
      this.socialForm.source = getQueryString('source');
      this.socialForm.code = getQueryString('code');
      this.socialForm.state = getQueryString('state');
      if (validatenull(this.socialForm.source) && topUrl.includes(redirectUrl)) {
        let source = topUrl.split('?')[0];
        source = source.split(redirectUrl)[1];
        this.socialForm.source = source;
      }
      if (
        !validatenull(this.socialForm.source)
        && !validatenull(this.socialForm.code) 
        && !validatenull(this.socialForm.state)
      ) {
        const loading = this.$loading({
          lock: true,
          text: '第三方系统登录中,请稍后。。。',
          spinner: 'el-icon-loading'
        });
        this.$store.dispatch('LoginBySocial', this.socialForm).then( res => {
          if ( res.user_id > 0) {
            window.location.href = `${topUrl.split(redirectUrl)[0]}#/info/index`;
          }
          // this.$router.push({path: this.tagWel.value});
          loading.close();
        }).catch(() => {
          loading.close();
        });
      }
    }
  },
};
</script>
<style lang="scss" scoped>
  @import "./index.scss";
</style>