module.exports = {
    "parser": "babel-eslint",
    // "parserOptions”: {
    //     "parser": "babel-eslint"
    // },
    "extends": "airbnb",
    "rules": {
        'max-len': [
            "error", 200
        ],
        // 'no-alert': 'off',
        'no-new': 'off',
        // "no-undef": "off",
        // "no-unused-vars": 'off',
        "no-console": "off", //允许console
        "indent": [
            "error", 4
        ], //4个空格缩进TabSize：4
        'comma-dangle': [
            "error", "only-multiline"
        ], //不强制尾逗号
        'array-bracket-spacing': [
            "error", "never"
        ], // 不用空格
        'space-in-parens': [
            "error", "never"
        ], // 不用空格
        'object-curly-spacing': [
            "error", "never"
        ], // 不用空格
        "no-plusplus": [
            "off", {
                "allowForLoopAfterthoughts": true
            }
        ], //支持++,++浏览器做了优化
        "no-restricted-syntax": [
            "error",
            // "ForInStatement",	//允许for in
            // "ForOfStatement",	//允许for of
            "LabeledStatement",
            "WithStatement"
        ],
        "import/no-extraneous-dependencies": 0, //禁止使用外来包
        // "import/no-webpack-loader-syntax": 0,
        // "import/no-unresolved": 0,
        // "sort-imports": ["error", {   // imports规则(http://eslint.org/docs/rules/sort-imports#rule-details)
        // 	"ignoreCase": false,
        // 	"ignoreMemberSort": false,
        // 	"memberSyntaxSortOrder": ["none", "all", "multiple", "single"]
        // }]
    },
    "env": {
        "browser": true,
        "node": true,
        "es6": true,
        "jquery": true,
        // "commonjs": true,
    },
    "globals": {},
    "plugins": []
};
