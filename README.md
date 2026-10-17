# Hero 冯生 · 个人品牌站

一个单页静态站。原生 HTML / CSS / JS，零依赖，不需要装任何开发环境。

---

## 一、怎么在电脑上预览

### 方法 A：直接双击（最简单）

双击 `index.html`，用浏览器打开即可。

### 方法 B：本地起个小服务（推荐，行为最接近线上）

在本文件夹（`site`）里打开终端，运行：

```bash
python -m http.server 8000
```

然后浏览器访问 <http://localhost:8000>

没装 Python 的话，用 Node：

```bash
npx serve .
```

### 怎么检查手机效果

1. 在浏览器里按 `F12` 打开开发者工具
2. 点左上角的手机图标（Toggle device toolbar），或按 `Ctrl + Shift + M`
3. 顶部宽度选 **iPhone SE（375px）** 和 **iPhone 14 Pro（393px）** 各看一遍
4. 重点看：首屏是否一屏内讲完、三张来意卡是否单列、数字墙是否两列、表单输入时键盘弹起会不会挡住按钮

---

## 二、怎么发布到 GitHub Pages

不需要安装 Git，全程网页操作。

### 1. 建仓库

- 登录 GitHub → 右上角 `+` → `New repository`
- 仓库名随便取，比如 `fengwenxiong` 或 `about`（**会影响网址**）
- 选 `Public`（Pages 免费版要求公开）
- 不要勾选 "Add a README file"
- 点 `Create repository`

### 2. 上传文件

- 进入新仓库，点 `uploading an existing file`
- 把 `site` 文件夹**里面的全部内容**拖进去（`index.html`、`assets` 文件夹、`README.md`、`.nojekyll`）
  - 注意：拖的是 `site` 里的东西，不是 `site` 这个文件夹本身
  - `assets` 整个文件夹一起拖，层级会自动保留
- 底部点 `Commit changes`

### 3. 开启 Pages

- 仓库页 → `Settings` → 左侧 `Pages`
- `Source` 选 `Deploy from a branch`
- `Branch` 选 `main`，目录选 `/ (root)` → `Save`
- 等 1–2 分钟，刷新页面，顶部会出现网址：

```
https://你的用户名.github.io/仓库名/
```

### 4. 之后改内容怎么办

仓库里点开 `index.html` → 右上角铅笔图标 → 改完 `Commit changes` → 等一分钟，线上自动更新。

### 5. 想用更好的域名

- Settings → Pages → `Custom domain`，填入你的域名
- 然后在域名服务商那里，加一条 CNAME 记录指向 `你的用户名.github.io`
- 注意：国内服务器做网站需要备案，GitHub Pages 走的是境外，一般不涉及备案，但访问速度不稳定

---

## 三、表单收件（已接通 Formsubmit）

留言会直接发到 **fengwenxiong@xinli001.com**。不需要注册，不需要服务器。

### 现在已经完成了什么

- 表单已指向 `https://formsubmit.co/ajax/fengwenxiong@xinli001.com`
- 端点可用，`https://hero-feng.github.io` 来源已实测提交成功

### ⚠️ 关键：激活是按「域名」绑定的

实测结果（同一个邮箱，不同来源域名）：

| 来源域名 | 结果 |
| --- | --- |
| `https://hero-feng.github.io` | ✅ 提交成功 |
| `https://fengwenxiong.github.io` | ❌ 需要激活 |
| `http://localhost:8765` | ❌ 需要激活 |

也就是说：**你点过的那封激活邮件，只对某一个具体域名生效。** 换个域名，Formsubmit 会重新判定为未激活。

注意 Origin 只包含 `协议 + 域名 + 端口`，**不包含仓库路径**。所以只要 GitHub 用户名一致，`用户名.github.io/任意仓库名/` 都算同一个域名，不用重复激活。

### 你还需要做一件事（部署之后再做）

1. 先把站点发布到 GitHub Pages
2. 用手机或电脑打开**真实网址**，在表单里随便填一封测试留言提交
3. 去 `fengwenxiong@xinli001.com` 找 Formsubmit 刚发来的邮件，点里面的「Activate Form」
4. 回到页面再提交一次，看到「已记录」就通了

顺序不能反：**先部署，再从真实域名触发激活**。在本地激活是无效的。

### ⚠️ 两个必须知道的副作用

**1. 邮箱会暴露在网页源码里。**
Formsubmit 的原理就是把邮箱写进提交地址，所以任何打开开发者工具、或查看页面源码的人都能看到 `fengwenxiong@xinli001.com`。
访客在页面上看不到，但懂技术的人能看到。

**2. 这个邮箱带了 xinli001.com 的域名。**
也就是说，一旦有人查看源码，你的"某互联网服务企业"就当场失效了——域名比任何文字都直接。
如果你介意，去注册一个中性邮箱（比如 QQ 邮箱、163），把 `index.html` 第 20 行的地址换掉即可，两分钟的事：

```html
<meta name="form-endpoint" content="https://formsubmit.co/ajax/你的新邮箱">
```

换完记得用新邮箱重新走一次激活。

### 本地预览时会怎样

直接双击 `index.html` 打开时，浏览器会拦截跨域请求，提交会显示"本地预览发不出去，这是正常的"。
**这不是故障**，部署到 GitHub Pages 后就正常了。
想本地测试真实提交，用 `python -m http.server 8000` 起服务再访问。

### 想换成 Formspree

把第 20 行改成：

```html
<meta name="form-endpoint" content="https://formspree.io/f/你的表单ID">
```

代码不用改，两种格式都兼容。

## 四、文件结构

```
site/
├── index.html              页面本体（所有文案在这里）
├── README.md               本文件
├── .nojekyll               让 GitHub Pages 原样发布，不跑 Jekyll
└── assets/
    ├── css/style.css       全部样式
    ├── js/app.js           交互 + 表单收件地址
    ├── favicon.svg         浏览器标签页图标
    └── img/
        ├── README.md       照片放置说明
        └── portrait.jpg    你的照片（需自己放进来）
```

---

## 五、改内容改哪里

| 想改什么 | 改哪里 |
|---|---|
| 文案、标题、段落 | `index.html`，都在对应 `<section>` 里，有中文注释 |
| 颜色、字号、间距 | `assets/css/style.css` 顶部 `:root` 里的变量 |
| 表单收件地址 | `assets/js/app.js` 的 `FORM_ENDPOINT` |
| 照片 | 放 `assets/img/portrait.jpg` |

**改颜色只需要动 `:root` 里这几行：**

```css
--bg:     #FAF9F6;   /* 页面底色（暖白纸） */
--bg-alt: #F1EFE9;   /* 浅灰底（照片位） */
--ink:    #14130F;   /* 正文与标题 */
--ink-3:  #8C8880;   /* 弱化文字、标签 */
--accent: #8A4B26;   /* 极小面积强调（编号、十字标签） */
```

风格基调是**黑白编辑风**：只靠留白、细线、字号层级拉开关系，不用阴影、不用圆角卡片、不用彩色块。
如果要加颜色，建议只改 `--accent` 一个变量，不要动其他。

---

## 六、状态说明

**已确认的内容**：身份口径、三类来意、六项数字、四件事（含 2019 筹建党支部、2021–2025 人效）、四条做法、超级面试官课程。

**关于人像**：已从简历中提取并处理为 4:5 黑白竖构图（`assets/img/portrait.jpg`，800×1000，95KB）。桌面端在标题右侧，手机端在标题下方。
换照片只需覆盖同名文件即可；若删掉文件，人像整块会**自动隐藏**，页面不留空框。

**仍待你补充的内容**（页面上已用明显的"待确认"样式标出，不会误导访客）：

1. 人像照片
2. ~~2017–2019 经历~~ 已补齐：2017 年起在现公司，至今约 9 年
3. 是否开放微信、以及"看完之后希望你做什么"的标准动作
4. 内训课题中除「超级面试官」外的五门，是否确认可讲
5. 评价素材（目前用"可以问介绍你来的人"替代，需要你认可这个说法）

**未写入的内容**（按你的指示回避）：

- 原行业字样
- 2025 年度内部经营数据的**金额与绝对值**（IPC 具体数值、奖金成本金额等）；只保留过程描述与效率类指标（25%、120 人、180+ 人）
- 内部员工真实姓名
- 未获授权的客户与雇主具名

---

© Hero 冯生　版式与配色为原创，未使用任何第三方模板、图片或标志。
