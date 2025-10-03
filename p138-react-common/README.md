# p138-react-common

通用工具库，提供所有项目共享的工具函数、Hooks和组件。

## 目录结构

```
p138-react-common/
├── api/                # API相关工具和类型定义
├── components/         # 通用UI组件
├── hooks/              # 自定义React Hooks
├── utils/              # 工具函数
├── store/              # 状态管理相关
├── types/              # 类型定义
└── dictionary/         # 字典/常量定义
```

## 工具函数 (utils)

提供各种常用工具函数，按功能分类：

### 日期时间处理 (dateUtils.ts)

```typescript
import { formatDate, formatDateTime, formatRelativeTime } from "@/p138-react-common/utils';

// 格式化日期
formatDate(new Date(), 'yyyy-MM-dd'); // 2023-05-20
formatDateTime(new Date()); // 2023-05-20 12:34:56
formatRelativeTime(new Date(Date.now() - 3600000)); // 1小时前
```

### 数值格式化 (numberUtils.ts)

```typescript
import { formatCurrency, formatPercent, formatNumber } from "@/p138-react-common/utils';

formatCurrency(1234.56); // ¥1,234.56
formatPercent(0.1234); // 12.34%
formatNumber(1234567, { separator: ',' }); // 1,234,567
```

### 错误处理 (errorHandler.ts)

```typescript
import { handleApiError, ErrorType, BusinessError } from "@/p138-react-common/utils';

try {
  // 业务代码
} catch (error) {
  const errorInfo = handleApiError(error, { showToast: true });
  console.log(errorInfo.code, errorInfo.message, errorInfo.type);
}
```

### 表单验证 (validationUtils.ts)

```typescript
import { isValidEmail, isValidPhone, required, composeValidators } from "@/p138-react-common/utils';

// 单独验证
isValidEmail('test@example.com'); // true

// 表单验证器
const validateEmail = composeValidators(
  required('邮箱不能为空'),
  email('邮箱格式不正确')
);
const error = validateEmail('invalid-email'); // 错误消息
```

### 其他常用工具

```typescript
import { 
  generateUUID, 
  deepClone, 
  debounce, 
  throttle, 
  capitalize, 
  getProperty 
} from "@/p138-react-common/utils';

// 生成UUID
const id = generateUUID();

// 深度克隆对象
const cloned = deepClone(complexObject);

// 防抖函数
const debouncedSave = debounce(saveFunction, 500);

// 节流函数
const throttledScroll = throttle(scrollHandler, 100);

// 首字母大写
capitalize('hello'); // Hello

// 安全获取对象属性
getProperty(user, 'profile.address.city', '未知'); // 如果属性链中任何一环为空，返回'未知'
```

## 自定义Hooks (hooks)

### 表单Hook (useForm.ts)

```typescript
import { useForm } from "@/p138-react-common/hooks';

const { 
  values, 
  errors, 
  handleChange, 
  handleBlur, 
  handleSubmit, 
  isSubmitting 
} = useForm({
  initialValues: { email: '', password: '' },
  validate: values => {
    const errors = {};
    if (!values.email) errors.email = '请输入邮箱';
    if (!values.password) errors.password = '请输入密码';
    return errors;
  },
  onSubmit: async (values) => {
    await loginApi(values);
  }
});
```

### 防抖/节流Hook (useDebounce.ts, useThrottle.ts)

```typescript
import { useDebounce, useThrottle } from "@/p138-react-common/hooks';

// 防抖值
const debouncedSearchTerm = useDebounce(searchTerm, 500);

// 节流值
const throttledScrollPosition = useThrottle(scrollPosition, 100);
```

### 异步操作Hook (useAsync.ts)

```typescript
import { useAsync } from "@/p138-react-common/hooks';

const { data, loading, error, execute } = useAsync(
  async (id) => {
    const response = await fetchUserData(id);
    return response.data;
  }
);

// 执行异步操作
useEffect(() => {
  execute(userId);
}, [userId]);
```

### 交叉观察器Hook (useIntersectionObserver.ts)

```typescript
import { useIntersectionObserver } from "@/p138-react-common/hooks';

// 检测元素是否在视口中
const [ref, isVisible] = useIntersectionObserver({
  threshold: 0.5,
  triggerOnce: true
});

// 在元素上使用ref
<div ref={ref}>
  {isVisible && <p>现在可见了!</p>}
</div>
```

## API工具 (api)

包含API请求的通用工具和类型定义。使用前需要在项目中正确配置。

```typescript
import { createApiClient } from "@/p138-react-common/api';

// 创建API客户端
const apiClient = createApiClient({
  baseURL: 'https://api.example.com',
  timeout: 5000
});

// 使用客户端发起请求
const response = await apiClient.get('/users');
```

## 注意事项

1. 部分工具依赖第三方包，请确保项目中已安装相应依赖
2. 不要在通用库中包含业务逻辑，只放置可复用的工具和组件
3. 所有代码需要编写完善的类型定义和文档注释
4. 对于有外部依赖的模块（如设备信息，本地存储等），建议按需导入而非统一导出

## 如何贡献

1. 遵循项目编码规范和命名约定
2. 在添加新功能前，请确认是否真的需要在通用库中实现
3. 所有导出的函数/组件必须有完整的TypeScript类型定义
4. 编写清晰的文档注释，包括函数描述、参数和返回值说明
5. 对于有平台差异的功能，请适当处理兼容性问题
