const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');

const constantsDir = path.join(__dirname); // 放在 constants/ 目录运行

// 自动生成文件模板内容
function getTemplateContent(type, moduleName) {
  switch(type) {
    case 'constant':
      return `// ${moduleName}.constant.ts\n\nexport const ${moduleName.toUpperCase()}_PLACEHOLDER = 'placeholder';\n`;
    case 'enum':
      return `// ${moduleName}.enum.ts\n\nexport enum ${moduleName}Enum {\n  PLACEHOLDER = 0\n}\n`;
    case 'map':
      return `// ${moduleName}.map.ts\n\nexport const ${moduleName}Map = {\n  PLACEHOLDER: 'placeholder'\n};\n`;
    case 'type':
      return `// ${moduleName}.type.ts\n\nexport type ${moduleName}Type = {\n  placeholder: string;\n};\n`;
    default:
      return '';
  }
}

// 更新 constants/index.ts
function updateIndex() {
  const subdirs = fs.readdirSync(constantsDir).filter(f =>
    fs.statSync(path.join(constantsDir, f)).isDirectory()
  );

  let content = '';
  subdirs.forEach(dir => {
    const files = fs.readdirSync(path.join(constantsDir, dir))
      .filter(f => f.endsWith('.ts') && f !== 'index.ts');
    files.forEach(file => {
      const nameWithoutExt = file.replace('.ts', '');
      content += `export * from './${dir}/${nameWithoutExt}';\n`;
    });
  });

  fs.writeFileSync(path.join(constantsDir, 'index.ts'), content, 'utf8');
  console.log('✅ 已更新 constants/index.ts');
}

// 主函数
async function main() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'moduleName',
      message: '请输入业务模块名（如 lottery）：',
      validate: input => input ? true : '模块名不能为空'
    }
  ]);

  const moduleName = answers.moduleName.trim();
  const moduleDir = path.join(constantsDir, moduleName);

  if (!fs.existsSync(moduleDir)) {
    fs.mkdirSync(moduleDir);
    console.log(`✅ 已创建目录 ${moduleDir}`);
  }

  const files = ['constant', 'enum', 'map', 'type'];
  files.forEach(type => {
    const fileName = `${moduleName}.${type}.ts`;
    const filePath = path.join(moduleDir, fileName);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, getTemplateContent(type, moduleName), 'utf8');
      console.log(`✅ 已创建文件 ${filePath}`);
    }
  });

  // 更新 index.ts
  updateIndex();
}

main();
