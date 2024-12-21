'use client';

import { useEffect, useRef, useState } from 'react';

// 代码雨组件
const CodeRain = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // 设置画布大小
        const setCanvasSize = () => {
            canvas.height = window.innerHeight;
            canvas.width = window.innerWidth;
        };

        setCanvasSize();
        window.addEventListener('resize', setCanvasSize);

        // 初始化参数
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const fontSize = 16;  // 增加字体大小
        const columns = canvas.width / fontSize;
        const drops = Array(Math.floor(columns)).fill(1);

        // 创建渐变色
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#0F0');  // 亮绿色
        gradient.addColorStop(0.5, '#0F0');
        gradient.addColorStop(1, '#003300');  // 深绿色

        // 绘制函数
        const draw = () => {
            // 设置半透明背景
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // 设置文字样式
            ctx.font = `bold ${fontSize}px monospace`;
            ctx.fillStyle = gradient;

            // 绘制字符
            for (let i = 0; i < drops.length; i++) {
                // 随机字符
                const text = characters[Math.floor(Math.random() * characters.length)];
                const x = i * fontSize;
                const y = drops[i] * fontSize;

                // 设置发光效果
                ctx.shadowBlur = 15;
                ctx.shadowColor = '#0F0';

                // 随机透明度
                const alpha = Math.random() * 0.9 + 0.1;
                ctx.fillStyle = `rgba(0, 255, 0, ${alpha})`;

                // 绘制文字
                ctx.fillText(text, x, y);

                // 重置阴影
                ctx.shadowBlur = 0;

                // 更新位置
                if (y > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };

        // 使用requestAnimationFrame代替setInterval
        let animationFrameId: number;
        const animate = () => {
            draw();
            animationFrameId = requestAnimationFrame(animate);
        };
        animate();

        // 清理函数
        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', setCanvasSize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full"
            style={{
                background: 'black',
                zIndex: 1
            }}
        />
    );
};

// 简化的引用文本组件
const QuoteDisplay = () => {
    const quotes = [
        "现实，只不过是电信号在你大脑中产生的电化学反应。",
        "选择相信什么，就是你的自由。",
        "无知即力量，但知识就是一切。",
        "系统中的漏洞，往往源于设计者的完美主义。",
        "代码如诗，循环往复，却蕴含无限可能。",
        "真相如同代码，隐藏在表象之下。",
        "在数字世界里，我们都是数据的诗人。",
        "每一个 Bug 都是通向完美的路标。",
        "算法，是这个世界最真实的魔法。",
        "在矩阵中，限制你的只有想象力。"
    ];

    const [text, setText] = useState('');
    const [index, setIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);

    useEffect(() => {
        // 打字效果
        const typingTimer = setInterval(() => {
            if (charIndex < quotes[index].length) {
                setText(prev => prev + quotes[index][charIndex]);
                setCharIndex(prev => prev + 1);
            }
        }, 150);

        // 清理定时器
        return () => clearInterval(typingTimer);
    }, [charIndex, index, quotes]);

    useEffect(() => {
        // 当前引用打印完成后，等待并切换到下一个
        if (charIndex === quotes[index].length) {
            const nextQuoteTimer = setTimeout(() => {
                setText('');
                setCharIndex(0);
                setIndex((prev) => (prev + 1) % quotes.length);
            }, 3000);

            return () => clearTimeout(nextQuoteTimer);
        }
    }, [charIndex, index, quotes]);

    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center text-center p-4 z-50">
            <h1 className="text-[#0F0] font-mono text-4xl mb-8 glitch-text select-none">
                Matrix Code
            </h1>
            <div className="text-[#0F0] font-mono text-2xl max-w-2xl mx-auto typing-text select-none">
                {text}
            </div>
            <style jsx>{`
                .glitch-text {
                    text-shadow: 
                        0.05em 0 0 rgba(255,0,0,.75),
                        -0.025em -0.05em 0 rgba(0,255,0,.75),
                        0.025em 0.05em 0 rgba(0,0,255,.75);
                    animation: glitch 500ms infinite;
                }

                @keyframes glitch {
                    0% { text-shadow: 0.05em 0 0 rgba(255,0,0,.75), -0.05em -0.025em 0 rgba(0,255,0,.75), -0.025em 0.05em 0 rgba(0,0,255,.75); }
                    15% { text-shadow: -0.05em -0.025em 0 rgba(255,0,0,.75), 0.025em 0.025em 0 rgba(0,255,0,.75), -0.05em -0.05em 0 rgba(0,0,255,.75); }
                    50% { text-shadow: 0.025em 0.05em 0 rgba(255,0,0,.75), 0.05em 0 0 rgba(0,255,0,.75), 0 -0.05em 0 rgba(0,0,255,.75); }
                    100% { text-shadow: -0.025em 0 0 rgba(255,0,0,.75), -0.025em -0.025em 0 rgba(0,255,0,.75), -0.025em -0.05em 0 rgba(0,0,255,.75); }
                }

                .typing-text {
                    border-right: 2px solid #0F0;
                    padding: 0.5em;
                    min-height: 4em;
                    background-color: rgba(0, 0, 0, 0.5);
                    text-shadow: 0 0 5px #0F0;
                    animation: blink 1s step-end infinite;
                    white-space: pre-wrap;
                    line-height: 1.5;
                }

                @keyframes blink {
                    from, to { border-color: transparent }
                    50% { border-color: #0F0 }
                }
            `}</style>
        </div>
    );
};

// 主页面组件
export default function Home() {
    return (
        <main className="min-h-screen overflow-hidden relative bg-black">
            <CodeRain />
            <div className="relative z-10">
                <QuoteDisplay />
            </div>
        </main>
    );
}
