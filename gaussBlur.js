(function (root) {
	/**
	 * 高斯模糊方法
	 * @param {*} imgData 
	 * @returns 
	 */
	function gaussBlur(imgData) {
		var pixes = imgData.data;
		var width = imgData.width;
		var height = imgData.height;
		var gaussMatrix = [],
			gaussSum = 0,
			x, y,
			r, g, b, a,
			i, j, k, len;

		var radius = 10;
		var sigma = 5;

		a = 1 / (Math.sqrt(2 * Math.PI) * sigma);
		b = -1 / (2 * sigma * sigma);
		//生成高斯矩阵
		for (i = 0, x = -radius; x <= radius; x++, i++) {
			g = a * Math.exp(b * x * x);
			gaussMatrix[i] = g;
			gaussSum += g;

		}
		//归一化, 保证高斯矩阵的值在[0,1]之间
		for (i = 0, len = gaussMatrix.length; i < len; i++) {
			gaussMatrix[i] /= gaussSum;
		}
		//x 方向一维高斯运算
		for (y = 0; y < height; y++) {
			for (x = 0; x < width; x++) {
				r = g = b = a = 0;
				gaussSum = 0;
				for (j = -radius; j <= radius; j++) {
					k = x + j;
					if (k >= 0 && k < width) { //确保 k 没超出 x 的范围
						//r,g,b,a 四个一组
						i = (y * width + k) * 4;
						r += pixes[i] * gaussMatrix[j + radius];
						g += pixes[i + 1] * gaussMatrix[j + radius];
						b += pixes[i + 2] * gaussMatrix[j + radius];
						// a += pixes[i + 3] * gaussMatrix[j];
						gaussSum += gaussMatrix[j + radius];
					}
				}
				i = (y * width + x) * 4;
				// 除以 gaussSum 是为了消除处于边缘的像素, 高斯运算不足的问题
				// console.log(gaussSum)
				pixes[i] = r / gaussSum;
				pixes[i + 1] = g / gaussSum;
				pixes[i + 2] = b / gaussSum;
				// pixes[i + 3] = a ;
			}
		}
		//y 方向一维高斯运算
		for (x = 0; x < width; x++) {
			for (y = 0; y < height; y++) {
				r = g = b = a = 0;
				gaussSum = 0;
				for (j = -radius; j <= radius; j++) {
					k = y + j;
					if (k >= 0 && k < height) { //确保 k 没超出 y 的范围
						i = (k * width + x) * 4;
						r += pixes[i] * gaussMatrix[j + radius];
						g += pixes[i + 1] * gaussMatrix[j + radius];
						b += pixes[i + 2] * gaussMatrix[j + radius];
						// a += pixes[i + 3] * gaussMatrix[j];
						gaussSum += gaussMatrix[j + radius];
					}
				}
				i = (y * width + x) * 4;
				pixes[i] = r / gaussSum;
				pixes[i + 1] = g / gaussSum;
				pixes[i + 2] = b / gaussSum;
			}
		}
		//end
		return imgData;
	}


	/**
	 * 图片模糊方法
	 */
	function blurImg(img, ele) {
		// 创建canvas元素
		var canvas = document.createElement('canvas');
		// 开启画笔
		var context = canvas.getContext('2d');

		// 设置画布大小，画布越小，所渲染出来的图片越模糊
		canvas.width = 900;
		canvas.height = 900;


		// 1.在canvas里画图片（截取）

		// 将需要模糊的图片渲染到canvas上
		context.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
		//参数：(图片,截取图片的x,截取图片的y,截取图片的宽度,截取图片的长度,在canvas上显示的位置x，在canvas上显示的位置y,在canvas上显示的宽度,在canvas上显示的长度)


		// 2.操作像素


		var imgData = context.getImageData(0, 0, canvas.width, canvas.height); //得到canvas上的图片的像素点数据
		// 参数：(画布起始点x,画布起始点y,获取的宽度,获取的长度)
		// 将得到的像素点数据用高斯模糊方法进行处理，返回新的像素点数据
		var gaussData = gaussBlur(imgData);
		// 将获取的新的像素点数据渲染到canvas上
		context.putImageData(gaussData, 0, 0);



		// 3. 获取canvas截取的图片

		// 获取到canvas上模糊图片的Base码，以Base码为src赋值给参数ele的src
		var imgSrc = canvas.toDataURL(); // 图片的Base码，相当于src地址
		ele.style.backgroundImage = 'url(' + imgSrc + ')';
	}

	// 将图片模糊函数定义为windo.player上的一个方法，方便调用
	root.blurImg = blurImg;
})(window.player || (window.player = {})); //方法是放在了window.player身上，如果用户传的这个参数没有，那就走默认值是个对象。如果有的话就使用自己