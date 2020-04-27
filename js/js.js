
        //全局axios 的默认配置
        axios.defaults.baseURL = 'https://lab.isaaclin.cn/nCoV/api/';
        axios.defaults.timeout = 10000;
        axios.interceptors.response.use(response => {
            return {
                data: response.data, //携带数据
                status: response.status //携带状态码
            };
        });

        //注册全局 过滤器
        Vue.filter('date', str => {
            //格式化 时间戳
            return formatDate(parseInt(str), 'yyyy-MM-dd hh:mm:ss');
        });

        // 侧边栏组件
        const asideNav = {
            template: '#aside-nav',
            data() {
                return {
                    texts: ['辟谣', 'NEWS', '知识'],
                    curentIndex: 0,
                    mode: 'day'
                };
            },
            computed: {
                backImg() {
                    if (this.mode === 'day') return './img/day.svg';
                    else return './img/night.svg';
                }
            },
            props: {
                tops: Array
            },
            methods: {
                Scroll(index) {
                    window.scrollTo(0, this.tops[index] + 1);

                    this.curentIndex = index;
                },
                //绑定 全局的滚动事件处理函数 ， 更改 currentIndex
                scrollHandler() {
                    try {
                        const y = window.pageYOffset;
                        const length = this.tops.length;
                        // console.log(y);
                        // console.log(this.tops);
                        

                        for (let i = 0; i < length; i++) {
                            if (i !== this.curentIndex) {
                                if (y > this.tops[i] && y < this.tops[i + 1]) {
                                    this.curentIndex = i;
                                    console.log(curentIndex);

                                    return;
                                }
                            }
                        }
                        //   this.curentIndex = 0;
                    } catch (err) {
                        // console.log(err);
                    }
                },
                //夜间模式的切换
                modeSwitch() {
                    if (this.mode === 'day') {
                        this.mode = 'night';
                        this.$message.success('切换夜间模式');
                        //设置html 根元素的 属性变量
                        document.documentElement.style.setProperty(
                            '--glo-back',
                            'black'
                        );
                        document.documentElement.style.setProperty(
                            '--text-color',
                            '#fff'
                        );
                        document.documentElement.style.setProperty(
                            '--local-back',
                            'black'
                        );
                        document.documentElement.style.setProperty(
                            '--new-item-title-color',
                            '#fff'
                        );
                    } else {
                        this.mode = 'day';
                        this.$message.success('切换日间模式');
                        //设置html 根元素的 属性变量
                        document.documentElement.style.setProperty(
                            '--glo-back',
                            'url(https://p0.ssl.qhimgs4.com/t01b52ec2aebf0a350c.webp)'
                        );
                        document.documentElement.style.setProperty(
                            '--text-color',
                            'black'
                        );
                        document.documentElement.style.setProperty(
                            '--local-back',
                            '#fff'
                        );
                        document.documentElement.style.setProperty(
                            '--new-item-title-color',
                            '#4169e2'
                        );
                    }
                },
                //识别 系统 模式  ，自动进入夜间模式 ，存在一定的兼容性问题
                autoSwitch() {
                    const colorSchemeQuery = matchMedia(
                        '(prefers-color-scheme: dark)'
                    );
                    // 进入页面,判断 浏览器是否支持 媒体查询'(prefers-color-scheme: dark)'
                    if (
                        colorSchemeQuery.media ===
                        '(prefers-color-scheme: dark)'
                    ) {
                        if (colorSchemeQuery.matches) {
                            this.modeSwitch(); //手动的 切换 夜间模式
                           this.$message.success('跟随系统 切换到夜间模式');
                            
                        }
                    }
                    else{
                        console.log('您的浏览器 不支持跟随系统 切换夜间模式');
                        
                    }
                }
            },
            created() {
                this.$nextTick(_ => {
                    window.addEventListener(
                        'scroll',
                        this.scrollHandler
                    );
                });
                //检测 系统颜色主题
                this.autoSwitch();
            }
        };
        //new-item 组件
        const newItem = {
            template: '#new-item',
            data() {
                return {};
            },
            props: {
                title: String,
                infoSource: String,
                summary: String,
                sourceUrl: String,
                pubDate: String
            }
        };
        //rumor-item 组件
        const rumorItem = {
            template: '#rumor-item',
            props: {
                title: String,
                mainSummary: String,
                body: String,
                index: Number
            }
        };
        const app = new Vue({
            name: 'APP',
            el: '#app',
            data() {
                return {
                    news: [],
                    newPage: 1,
                    rumors: [],
                    tops: [0],
                    tabName: 'jianjie',
                    imgSrc: [
                        'https://file1.dxycdn.com/2020/0130/757/3393849506277163545-22.jpg',
                        'https://file1.dxycdn.com/2020/0208/615/3395549976171289431-22.jpg',
                        'https://file1.dxycdn.com/2020/0206/330/3395103241590413873-22.jpg'
                    ],
                    showImg: '',
                    dialogVisible: false
                };
            },
            filters: {},
            methods: {
                async getNews(page) {
                    const news = await axios
                        .get('news', {
                            params: {
                                page: page,
                                num: 10
                            }
                        })
                        .catch(err => err);
                    console.log(news);
                      console.log(page);
   
                    if (news.status === 200) {
                        this.news = news.data.results;
                        this.newPage = page;
                    } else {
                        this.$message.error('新闻获取失败，请刷新网页');
                        console.log('新闻获取失败，请刷新网页');
                    }

                },
                async getRumors(page) {
                    const rumors = await axios
                        .get('rumors', {
                            params: {
                                page: page,
                                num: 10,
                                rumorType: 0
                            }
                        })
                        .catch(err => err);
                    // console.log(rumors);

                    if (rumors.status === 200) {
                        this.rumors = rumors.data.results;
                        return  Promise.resolve();
                    } else {
                        this.$message.error('谣言获取失败，请刷新网页');
                        // console.log('谣言获取失败，请刷新网页');
                        return Promise.reject('谣言获取失败，请刷新网页')
                    }
                },
                //dom 加载完成后 获取 每个部分的top
                getTops() {
                    this.tops=[0];
                    this.tops.push(
                        30 + document.querySelector('.news-h').offsetTop
                    );
                    // console.log(document.querySelector('.zhishis-h').offsetTop);
                    this.tops.push(
                        30 + document.querySelector('.zhishis-h').offsetTop
                    );
                    this.tops.push(Number.MAX_VALUE); //在末尾添加一个 最大的数字
                },
                showDialog(index) {
                    this.showImg = this.imgSrc[index];
                    this.dialogVisible = true;
                }
            },

            components: {
                'aside-nav': asideNav,
                'new-item': newItem,
                'rumor-item': rumorItem
            },
            created() {
                //由于 github 开源服务器 限定 一个ip 在1s 内请求的次数 有限  ，
                //所以 必须在一个请求完成后再请求另一个
                this.getRumors(1).then(_=>{
                   setTimeout(() => {
                    this.getNews(1);
                }, 500);
                })
                .catch(err=>{
                    console.log(err);
                    
                })
                // setTimeout(() => {
                //     this.getNews(1);
                // }, 2000);
                
            },
            mounted() {
                //news 数据获取到之后才计算 offsettop  保证 tops 的正确性
                this.$watch('news', _ => {
                    this.getTops();
                });
            }
        });

        console.log('version:1.0.0   supported by ltt(•̀ᴗ•́)و ̑̑   CQUT ');
        console.log('          Copyright @ ltt');

       
    