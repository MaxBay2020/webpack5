module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                useBuiltIns: 'usage',
                corejs: '3.0'
            }
        ],
        [
            '@babel/preset-react',
            {
                // 自动注入 React，无需 import React from 'react'
                runtime: 'automatic'
            }
        ]
    ],
    plugins: [
        // 仅开发环境使用此plugin；
        process.env.NODE_ENV === 'development' && 'react-refresh/babel'
    ].filter(Boolean)
}