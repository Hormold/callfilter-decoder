class Database {

	constructor(phoneNumber, fileContent, fileName, dbName) {
		this.phoneNumber = phoneNumber;
		this.fileContent = fileContent;
		this.fileName = fileName;
		this.dbName = dbName;
		this.statusMap = {
			10: 'neutral, scam',
			40: 'neutral, shop',
			80: 'positive, other',
			110: 'scam',
			120: 'adv',
			130: 'finance',
			140: 'polls',
			150: 'collectors',
			160: 'company',
			170: 'shop',
			180: 'other'
		};

	}

	shortCode() {
		const code = this.phoneNumber.substring(3);
		const var9 = +code;
		this.shortCode = var9;
		this.shortCodeString = code;
	}

	decode() {
		this.shortCode();
		const firstTwo = this.readBytes(2);
		if (this.bytesToSting(firstTwo) !== 'ZI') {
			throw new Error("Unexpected file header");
		}

		const count = this.readBytes(3);
		const countInt = this.byteToInt(count[0]) | this.byteToInt(count[1]) << 8 | this.byteToInt(count[2]) << 16;
		this.countInt = countInt;
		// console.log("Count: ", countInt);
		const version = this.readBytes(2);
		this.versionInt = this.byteToInt(version[1]) | this.byteToInt(version[0]) << 8;
		// console.log("Version: ", (this.versionInt));

		if (this.shortCodeString.length > 8) {
			this.shortCodeString = this.shortCodeString.substring(0, 9);
		}

		// read 200 bytes
		const numbers = [];
		for (let i = 0; i < this.countInt; i++) {
			try {
				// read bytes untill 0
				let status;

				const bytes = this.readBytes(6);
				// first 4 are number
				let number = [];
				for (let j = 0; j < 4; j++) {
					let b = this.byteToInt(bytes[j]);
					if (b < 16) {
						b = '0' + b.toString(16);
					} else {
						b = b.toString(16);
					}
					number.push(b);
				}
				const endian = number.map((x) => x.toString(16)).join('');
				var r = parseInt('0x' + endian.match(/../g).reverse().join(''));
				// if endian ends with 00, then add leading zero to r
				if (endian.endsWith('00')) {
					r = '0' + r;
				}
				// last 1 are status
				status = this.byteToInt(bytes[5]);
				if (this.dbName.length === 4) {
					// remove first symbol of number
					r = r.toString().substring(1);
				} else if (this.dbName.length === 5) {
					// remove first 2 symbols of number
					r = r.toString().substring(2);
				}
				let fullNumber = this.dbName + r;
				//console.log('Number: ', r);
				//console.log("Status: ", status);
				numbers.push([fullNumber, status]);
				if (!this.statusMap[status]) {
					//console.log("Unknown status: ", status, fullNumber, this.dbName, r);
				}
				//console.log("Number: ", fullNumber, " Status: ", status);
			} catch (err) {
				console.log("Error: ", err);
			}
		}
		return numbers;

	}

	readBytes(num) {
		let var1 = this.fileContent.slice(0, num);
		this.fileContent = this.fileContent.slice(num);
		return var1;
	}

	byteToInt(var1) {
		return var1 & 255;
	}


	bytesToSting(var1) {
		return String.fromCharCode.apply(null, var1);
	}
}

module.exports = Database;