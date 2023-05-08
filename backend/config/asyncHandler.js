/*
 * This is a middleware that wraps the async functions and catches any errors
 * that may occur in the async function and passes it to the next middleware
 * in the chain.
 * 
 * This is a replacement for the express-async-handler package.
 * 
 */

const asyncUtil = fn =>
	function asyncUtilWrap(...args) {
		const fnReturn = fn(...args);
		const next = args[args.length - 1];
		return Promise.resolve(fnReturn).catch(next);
	};

module.exports = asyncUtil;
