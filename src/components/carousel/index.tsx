import React, {useState, useRef, useEffect, useCallback} from 'react';

import './index.css';

export type DotPosition = 'top' | 'bottom' | 'left' | 'right';
export interface CarouselProps {
    children: any[],
    dots?: boolean, // 是否显示指示器
    autoPlay?: boolean, // 是否自动播放
    dotPosition?: DotPosition, // 指示器位置（未实现）
    afterChange?: Function, // 切换后回调（未实现）
    beforeChange?: Function, // 切换前回调（未实现）
}

export default (props: CarouselProps):JSX.Element => {
    const defaultProps = {
        dots: false,
        autoPlay: false,
        dotPosition: 'bottom'
    }
    props = Object.assign({}, defaultProps, props);

    const carouselContainer = useRef<HTMLDivElement>(null);
    const carouselInner = useRef<HTMLDivElement>(null);
    const [carouselWidth, setCarouselWidth] = useState(0);
    const [translate, setTranslate]  = useState<number>(0);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const dotsContainer = useRef<any>(null);
    let { children, autoPlay, dots }:CarouselProps = props;

    let next = useCallback(
        (index: number) => {
            let width = carouselContainer.current?.clientWidth || 0;
            carouselAnimate(width*index*(-1), () => {
                setCurrentIndex(index);
                if (autoPlay) {
                    dotsAnimate(() => {
                        index++;
                        index = index > children.length-1 ? 0 : index;
                        next(index);
                    })
                }
            })
        },
        [autoPlay, children]
    )

    useEffect(() => {
        if (carouselContainer) {
            setCarouselWidth(carouselContainer.current?.clientWidth || 0);
        }
    }, [carouselContainer]);

    useEffect(() => {
        if (autoPlay) {
            next(0);
        }
        return () => {
            intervalRef.current && clearInterval(intervalRef.current);
        }
    }, [autoPlay, next])

    // 轮播图动画
    function carouselAnimate(target: number, callback: Function):void {
        let transform, current, offset;
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        intervalRef.current = setInterval(() => {
            transform = carouselInner.current?.style.transform;
            transform = transform?.replace('translate3d(', '');
            current = parseInt(transform ? transform : '0');
            offset = (target - current) * 0.2
            if (Math.abs(offset) <= 2) {
                setTranslate(target);
                intervalRef.current && clearInterval(intervalRef.current);
                callback();
            } else {
                setTranslate(current + offset)
            }
        }, 80);
    }
    // 指示器动画
    function dotsAnimate(callback: Function):void {
        let sLeft: number = -60;
        let dotInner = dotsContainer.current?.querySelector('.dots-item-current');
        let dotInners: NodeList = dotsContainer.current?.querySelectorAll('.custom-carousel-dots-item-inner');
        if (!dotInner) {
            setTimeout(callback, 2000);
            return;
        };
        dotInners.forEach((dotInnerDom: any) => {
            dotInnerDom.style.left = '-60px';
        })

        intervalRef.current && clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            sLeft += 1;
            if (sLeft >= 0) {
                intervalRef.current && clearInterval(intervalRef.current);
                dotInner.style.left = '0px';
                callback();
            }
            dotInner.style.left = sLeft + 'px'
        }, 50);
    }
    
    return (
        <div ref={carouselContainer} className="custom-carousel-container">
            <div ref={carouselInner} className="custom-carousel-inner" style={{width: carouselWidth*children.length+'px', transform: 'translate3d('+ translate +'px, 0px, 0px)'}}>
                {
                    children.map((child: any, index: Number) => {
                        let cd = React.cloneElement(child, {
                            style: Object.assign({
                                width: `${carouselWidth}px`,
                            }, child.props.style),
                            key: `${index}`
                        });
                        
                        return cd;
                    })
                }
            </div>
            {
                dots ? (
                    <div ref={dotsContainer} className="custom-carousel-dots" style={{width: carouselWidth+'px'}}>
                    {
                        children.map((_, index: number) => {
                            return (
                                <div onClick={() => {next(index);}} className="custom-carousel-dots-item" key={index.toString()} >
                                    <div className={'custom-carousel-dots-item-inner ' + (index === currentIndex ? 'dots-item-current' : '') }></div>
                                </div>
                            );
                        })
                    }
                    </div>
                ): null
            }
        </div>
    );
}