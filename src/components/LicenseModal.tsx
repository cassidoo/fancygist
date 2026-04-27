import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const spring = { type: "spring" as const, stiffness: 400, damping: 30 };

interface License {
	name: string;
	description: string;
	text: string;
}

const licenses: License[] = [
	{
		name: "MIT License",
		description: "Permissive, allows commercial use, requires license notice",
		text: `MIT License

Copyright (c) ${new Date().getFullYear()}

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`,
	},
	{
		name: "Apache 2.0",
		description: "Permissive, includes explicit grant of patent rights",
		text: `Apache License
Version 2.0, January 2004

TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION

1. Definitions.
   "License" shall mean the terms and conditions for use, reproduction,
   and distribution as defined in this document.

2. Grant of Copyright License.
   Subject to the terms and conditions of this License, each Contributor
   hereby grants to You a perpetual, worldwide, non-exclusive, no-charge,
   royalty-free, irrevocable copyright license to reproduce, prepare
   Derivative Works of, publicly display, publicly perform, sublicense,
   and distribute the Work and such Derivative Works in Source or Object form.`,
	},
	{
		name: "GPL 3.0",
		description: "Copyleft, requires derivative works to be open source",
		text: `GNU GENERAL PUBLIC LICENSE
Version 3, 29 June 2007

Copyright (C) 2007 Free Software Foundation, Inc. <https://fsf.org/>

Everyone is permitted to copy and distribute verbatim copies
of this license document, but changing it is not allowed.`,
	},
	{
		name: "Creative Commons 4.0 BY",
		description: "CC BY - Requires attribution, allows commercial use",
		text: `Creative Commons Attribution 4.0 International Public License

By exercising any rights to the Work provided here, You accept and agree
to be bound by the terms and conditions of this Creative Commons Public
License ("Public License"). To the extent this Public License may be
interpreted as a contract, You are granted the rights set forth herein in
consideration for Your acceptance of these terms and conditions, and the
Licensor grants You such rights in consideration of benefits the Licensor
receives from making the Work available under these terms and conditions.

1. Definitions
   a. Adapted Material means material subject to Copyright and Similar
      Rights that is derived from or based upon the Work and in which
      the Work is translated, altered, arranged, transformed, or
      otherwise modified in a manner requiring permission under the
      Copyright and Similar Rights held by the Licensor.`,
	},
	{
		name: "Creative Commons 4.0 BY-SA",
		description: "CC BY-SA - Requires attribution and share alike",
		text: `Creative Commons Attribution-ShareAlike 4.0 International Public License

By exercising any rights to the Work provided here, You accept and agree
to be bound by the terms and conditions of this Creative Commons Public
License ("Public License").

The Work is protected by copyright and/or related or neighboring rights.
Any use of the Work other than as authorized under this Public License or
copyright and related or neighboring rights law is prohibited.`,
	},
	{
		name: "Creative Commons 4.0 BY-NC",
		description: "CC BY-NC - Requires attribution, non-commercial only",
		text: `Creative Commons Attribution-NonCommercial 4.0 International Public License

By exercising any rights to the Work provided here, You accept and agree
to be bound by the terms and conditions of this Creative Commons Public
License ("Public License").

To the extent this Public License may be interpreted as a contract, You are
granted the rights set forth herein in consideration for Your acceptance of
these terms and conditions.`,
	},
	{
		name: "Creative Commons 4.0 BY-ND",
		description: "CC BY-ND - Requires attribution, no derivatives",
		text: `Creative Commons Attribution-NoDerivatives 4.0 International Public License

By exercising any rights to the Work provided here, You accept and agree
to be bound by the terms and conditions of this Creative Commons Public
License ("Public License").

The Work is protected by copyright and/or related or neighboring rights.`,
	},
	{
		name: "Unlicense",
		description: "Public domain, no restrictions",
		text: `This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any means.

In jurisdictions that recognize copyright laws, the author or authors
of this software dedicate any and all copyright interest in the
software to the public domain. We make this dedication for the benefit
of the public domain and to the estate of all our future readers and users.`,
	},
];

interface LicenseModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSelectLicense: (licenseText: string) => void;
}

export default function LicenseModal({
	isOpen,
	onClose,
	onSelectLicense,
}: LicenseModalProps) {
	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					onClick={onClose}
				>
					<motion.div
						className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col"
						initial={{ scale: 0.95, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.95, opacity: 0 }}
						transition={spring}
						onClick={(e: React.MouseEvent) => e.stopPropagation()}
					>
						<div className="flex items-center justify-between p-6 border-b">
							<h2 className="text-2xl font-bold">Select a License</h2>
							<button
								onClick={onClose}
								className="p-1 hover:bg-gray-100 rounded transition-colors"
								aria-label="Close"
							>
								<X size={24} />
							</button>
						</div>

						<div className="overflow-y-auto flex-1 p-6">
							<div className="grid gap-3">
								{licenses.map((license) => (
									<button
										key={license.name}
										onClick={() => {
											onSelectLicense(license.text);
											onClose();
										}}
										className="text-left p-4 border border-gray-200 rounded-lg hover:border-lime-600 hover:bg-lime-50 transition-colors"
									>
										<div className="font-semibold text-gray-900">
											{license.name}
										</div>
										<div className="text-sm text-gray-600 mt-1">
											{license.description}
										</div>
									</button>
								))}
							</div>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
