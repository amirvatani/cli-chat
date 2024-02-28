#!/usr/bin/env node

import {Box, Text, useApp, render, Spacer, useInput} from 'ink';
import React, {useState, useEffect} from 'react';
import getmac from 'getmac';
import admin from 'firebase-admin';
admin.initializeApp({
	credential: admin.credential.cert({
		type: 'service_account',
		project_id: 'breaktime-3fbd9',
		private_key_id: 'c10d4884c39bb358338b37d84865b99d153adce5',
		private_key:
			'-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDUnNBJ37D449hM\n+cy0pNOGxsDjrU3rbiGNz7Gfb1+4DhhaS3cOklKx/TTLyO22gK+ZlDUIz11ouTkA\nyFseBy1nNpLgDUyYEuAw7NtfVrahTeQZ6z4AsWv1khT5f8onT65qdpL2xnVJVuSs\nDOnkVI2JRhxMPCzo2cvRLuIMoeYU4KASl/dYQle+S0CsE+5cCaZwcvlb2mX3UaEl\nwGqSysGvXbRnQsM7gmXxZxVXSrSGpJrbXCdNOxdcbfrWfgjfPFn2qSBEfO7e5EM6\n0g65CzrEgN4zmaoTzmwVwapjQNTG8dnFR/NEM5jv0ATWyivRyW9oiaHujMw44Svi\nVl7Yj3MhAgMBAAECggEAERVwnx78R2N3c+f2jOVZodDCmwjH5Az7YTu5GAiI9m8b\ngdXigSc8wdSIs383qpx4f6yq/kQ7Szjm3as7txP4j/yQnLQ03VtW7Fd74RNEpX1u\nwK5oUwHunNLaIJomEjaS2zcf4/haYEQ9J536BUDOBqO9jlqfeS5W9D4CJ+WyaSbl\n01fT92F4FXLl/+CBvXWf0TXeDgDuCvz9m5ppseTYzeOjTavUHZa+rl66Lh0jG5P/\neZnxWDicZDVo5Xm54xt8hEtHx6HKsbw9Gofkq5yDRPA6AW5SRN8f/fwMAgqoMXpG\nDK0vaoARDuH/ZglmYG7AfrvQcQ/7dwREpJapqCrwyQKBgQD+hdc9uhhBqXxgi+nZ\nevlml7WafOg8zP4kaAoGkqKzI9xZNpEZMQpkI3Yu2XmhZOQg7qCM23kYAbH4+it/\nJTFajb394JhaEv8ccMWN4MDRPm/w+TvNP6irzE5S6nGlhVjfcAyaCewNzcOsC9KZ\n/pLlDRUOqVK0Zpve/NrLkd+lrwKBgQDV2LRQQv4Rd4sifowz5Xg4g5VyINF9dy7N\ns+Q4CfM6dLuJme+0qsFNr1fWaHW3/rI61/RWklTH/f0xdYXO0KFUZbhH4CujgDTv\nPCU86C2v8W4GVE98zqKMmuzgXSoUtOL9sJDOmLZngGehOcSBTfTd5pKoniti1Rpw\niYoM3gp4LwKBgByTbk0R3bNRkhNM4h52vhWUpuEHcROSeF4iCC4gvH+cYRrrE3Ne\nnCoOCTDNXeiO6UYBRKlL4tadKhwoCkYmKNpf25rrYm+KfnX0+1koiL11YyAM+3fZ\n09gmAg0xIT1SMV40uFV7E7OhDHz+ftCnUlrBE0IoJI74jjuE7BO69v8lAoGAFLDL\n+XwR4xTC9Ipz/E12jVlF6237dv1CHQsLyNRFoWFMB+tKAxwGagLOJ+OhiDTvf7wH\nWxz7cQJFLjTlxnXvNiBFbUbmUgKEnKUgIT2BtiVQ9PHRYw0HMz2GL8sz2B8MW2lr\nCWJDO85zuGjDd5NYXuQBSqlLH1vpG/xizA3ry2cCgYB1doBaBhpLOyjakGwCszEj\nzx1x3/wfn9kuc0bPUT7vgX+F3sPhoxj2m7hwLFmeBlDdlNOf9tB9HGUAPdFf2GJx\nGuAimKKA5sM/5rgBwb83IGOoHwi+RKtHpDMmsRGZDGYQs0J4I5c9yBFoA4kNyAXp\na+dLyZIUhoCVBLvQJOynxg==\n-----END PRIVATE KEY-----\n',
		client_email:
			'firebase-adminsdk-ppxc6@breaktime-3fbd9.iam.gserviceaccount.com',
		client_id: '115334976281148174797',
		auth_uri: 'https://accounts.google.com/o/oauth2/auth',
		token_uri: 'https://oauth2.googleapis.com/token',
		auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
		client_x509_cert_url:
			'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-ppxc6%40breaktime-3fbd9.iam.gserviceaccount.com',
		universe_domain: 'googleapis.com',
	}),
	databaseURL: 'https://breaktime-3fbd9.firebaseio.com', // Replace this with your Firebase project URL
});
const db = admin.firestore();
const userId = getmac();
export async function sendNewMessage({text, username}) {
	db.collection('messages').add({
		sender: getmac(),
		text,
		time: new Date().toString(),
		username,
	});
}
export function getMessages(cb) {
	return db
		.collection('messages')
		.orderBy('time', 'asc')
		.onSnapshot(snapshot => {
			const messages = [];
			snapshot.forEach(doc => {
				messages.push(doc.data());
			});
			cb(messages);
		});
}
const ChatBox = () => {
	const [messages, setMessages] = useState([]);
	const [username, setUsername] = useState(null);
	useEffect(() => {
		getMessages(msgs => {
			setMessages(msgs);
		});
	}, []);
	const sendMessage = message => {
		sendNewMessage({
			text: message,
			username,
		});
	};
	return /*#__PURE__*/ React.createElement(
		Box,
		{
			flexDirection: 'column',
		},
		messages.map((message, index) =>
			/*#__PURE__*/ React.createElement(Message, {
				key: message.time,
				sender: message.sender,
				text: message.text,
				username: message.username,
				time: message.time,
			}),
		),
		/*#__PURE__*/ React.createElement(Spacer, null),
		!username
			? /*#__PURE__*/ React.createElement(
					Box,
					null,
					/*#__PURE__*/ React.createElement(
						Text,
						null,
						'Enter Your User Name :',
					),
					/*#__PURE__*/ React.createElement(TextInput, {
						onSubmit: username => {
							setUsername(username);
						},
					}),
			  )
			: /*#__PURE__*/ React.createElement(ChatInput, {
					onSubmit: sendMessage,
			  }),
	);
};
const Message = ({text, time, username}) =>
	/*#__PURE__*/ React.createElement(
		Box,
		null,
		/*#__PURE__*/ React.createElement(
			Text,
			null,
			new Date(time).toString() + '  ',
			username,
			' :',
			text,
		),
	);
const ChatInput = ({onSubmit}) => {
	return /*#__PURE__*/ React.createElement(
		Box,
		null,
		/*#__PURE__*/ React.createElement(Text, null, 'Type Your Message :'),
		/*#__PURE__*/ React.createElement(TextInput, {
			onSubmit: onSubmit,
		}),
	);
};
const TextInput = ({onSubmit}) => {
	const [input, setInput] = useState('');
	useInput((word, key) => {
		if (key.delete) {
			const newString = input.split('');
			newString.pop();
			setInput(newString.join(''));
		} else if (key.return) {
			onSubmit(input);
			setInput('');
		} else {
			setInput(input + word);
		}
	});
	return /*#__PURE__*/ React.createElement(
		Box,
		null,
		/*#__PURE__*/ React.createElement(Text, null, input),
	);
};
render(/*#__PURE__*/ React.createElement(ChatBox, null));
