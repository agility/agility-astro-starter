

import * as crypto from 'crypto'
import { Buffer } from 'buffer';


export const generatePreviewKey = (securityKey: string) => {

	//the string we want to encode
	const str = `-1_${securityKey}_Preview`;

	let data = [];
	for (var i = 0; i < str.length; ++i) {
		data.push(str.charCodeAt(i));
		data.push(0);
	}

	//convert byte array to buffer
	const strBuffer = Buffer.from(data);

	const hash = crypto.createHash('sha512')

	const digest = hash.update(strBuffer);

	//convert the buffer to base64
	const outputBuffer = digest.digest('base64');
	return outputBuffer.toString();


};