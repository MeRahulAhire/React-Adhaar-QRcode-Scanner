import React, { useState } from 'react';
import { Cameras, Scanner } from 'react-instascan-new';
import './App.css';
import axios from 'axios';
function App() {
	const [ state, setState ] = useState({
		name: '',
		address: '',
		gender: '',
		DOB: '',
		YOB: '',
		adhaarNum: '',
		cameraOption:0
	});
	const { name, address, gender, DOB, YOB, adhaarNum, cameraOption } = state;
	const value = { name, address, gender, DOB, YOB, adhaarNum, cameraOption };

	const handleChange = (input) => (e) => {
		setState({ ...state, [input]: e.target.value });
	};
	const cameraChanger = () => {
		const camera = document.getElementById('camSelect')
		setState({...state, cameraOption: camera.selectedOptions[0].value})
	}

	const scanResult = (qrCode) => {
		axios
			.post('https://adhaarscan.herokuapp.com/adhaarJson', {
				adhaarData: qrCode
			})
			.then(function(res) {
				const data = res.data.PrintLetterBarcodeData.$;
				const addressFormat = `${data.house}, ${data.street}, ${data.lm}, ${data.loc}, ${data.vtc}, ${data.po}, ${data.dist}, ${data.subdist}, ${data.state}, ${data.pc}`;
				setState({
					...state,
					name: data.name,
					YOB: data.yob,
					DOB: data.dob,
					gender: data.gender,
					adhaarNum: data.uid,
					address: addressFormat
				});
			})
			.catch(function(error) {
				console.log(error.response);
			});
			
	};
	return (
		<div className="App-container">
			<div className="App">
			<div className="scanner">
				<Cameras>
					{(cameras) => (
						<div className="video-container">
							<Scanner camera={cameras[cameraOption]} onScan={scanResult} options={{ mirror: false }}>
								<video style={{ width: '90%' }} />
							</Scanner>
						</div>
					)}
				</Cameras>
				<div className="qrcode-banner">Scan your Adhaar Card</div>
				<div className="select-box">
				<select id="camSelect" onChange={cameraChanger}>
					<option value="0">Camera 1 (Front)</option>
					<option value="1">Camera 2 (Rear)</option>
				</select>
				</div>
			</div>
			<div className="form-container">
				<div className="form">
					<div className="form-head">Person's Data</div>
					<div className="data-container">
						<div className="input-header">Name:</div>
						<input onChange={handleChange('name')} value={value.name} type="text" className="data-value" />
						<div className="horizontal">
							<div className="half-part gender">
								<div className="input-header">Gender:</div>
								<input
									onChange={handleChange('gender')}
									value={value.gender}
									type="text"
									className="data-value"
								/>
							</div>
							<div className="half-part yob">
								<div className="input-header">Year of Birth</div>
								<input
									onChange={handleChange('YOB')}
									value={value.YOB}
									type="text"
									className="data-value"
								/>
							</div>
						</div>
						<div className="input-header margin">Date of Birth:</div>
						<input onChange={handleChange('DOB')} value={value.DOB} type="text" className="data-value" />
						<div className="input-header margin">Adhaar Number:</div>
						<input
							onChange={handleChange('adhaarNum')}
							value={value.adhaarNum}
							type="text"
							className="data-value"
						/>
						<div className="input-header margin">Address:</div>
						<textarea
							onChange={handleChange('address')}
							value={value.address}
							type="text"
							className="data-value address"
						/>
					</div>
				</div>
			</div>
			</div>
			<div className="footer">
				<h3>This is an open sourced Project</h3>
				<p className="p">We Dont Collect your Adhaar Card Data</p>
				<p className="p">
					source code available at 
				</p>
					<a title="view source code"
						href="https://github.com/MeRahulAhire/React-Adhaar-QRcode-Scanner/tree/master"
						target="_blank"
						rel="noopener noreferrer"
					><img style={{width: '50px'}} src="https://cdn.afterdawn.fi/v3/news/original/github-logo.png" alt="Github logo"/></a>
			</div>
		</div>
	);
}

export default App;
