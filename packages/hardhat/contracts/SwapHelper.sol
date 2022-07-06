// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-periphery/contracts/interfaces/IPeripheryPayments.sol";

interface ISwapHelper {
    function swapExactOutputSingle(uint256 amountOut) external payable;
}

contract SwapHelper is ISwapHelper {
    address public constant WETH9 = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    address public constant USDC = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;
    // NOTE: Does not work with SwapRouter02
    address public constant swapRouter =
        0xE592427A0AEce92De3Edee1F18E0157C05861564;

    /// @notice swaps a minimum possible amount of WETH for a fixed amount of USDC.
    ///         This contract receives the output USDC to use later operations.
    function swapExactOutputSingle(uint256 amountOut) external payable {
        require(amountOut > 0, "Must pass non 0 DAI amount");
        require(msg.value > 0, "Must pass non 0 ETH amount");
        uint256 amountInMaximum = msg.value;

        ISwapRouter.ExactOutputSingleParams memory params = ISwapRouter
            .ExactOutputSingleParams({
                tokenIn: WETH9,
                tokenOut: USDC,
                fee: 500, // pool fee to 0.05%.
                recipient: address(this),
                deadline: block.timestamp,
                amountOut: amountOut,
                amountInMaximum: amountInMaximum,
                sqrtPriceLimitX96: 0
            });

        ISwapRouter(swapRouter).exactOutputSingle{value: msg.value}(params);
        IPeripheryPayments(swapRouter).refundETH();

        // refund leftover ETH to user
        (bool success, ) = msg.sender.call{value: address(this).balance}("");
        require(success, "refund failed");
    }

    receive() external payable {}
}
