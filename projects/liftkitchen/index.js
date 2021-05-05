const sdk = require("@defillama/sdk");
const abi = require("./abi.json");

const wbtc = '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599';

const ctrl = '0xA31fDbaA772745D11843EFEDA9922dcbf5460672';
const lfbtc = '0xafcE9B78D409bF74980CACF610AFB851BF02F257';
const lift = '0xf9209d900f7ad1DC45376a2caA61c78f6dEA53B6';

const boardroom = '0x3223689b39Db8a897a9A9F0907C8a75d42268787';
const ideaFund = '0x918b4FDbC30B628564E07fd2120009b0078F4343';

const liquidityPools = [
    { 'contract': '0x4DB2fa451e1051A013A42FaD98b04C2aB81043Af', 'lpt': '0xd975b774C50aa0aEacB7b546b86218c1D7362123' }, //wBTC-lfBTC
    { 'contract': '0xC3C79869ED93c88E1227a1Ca3542c9B947BA9e0c', 'lpt': '0x0e250c3FF736491712C5b11EcEe6d8dbFA41c78f' } //lfBTC-LIFT
];

async function tvl(timestamp, block) {
  let balances = {};

  //boardroom
  const boardroomCtrlStaked = await sdk.api.abi.call({
    target: boardroom,
    abi: abi['gettotalSupplyControl'],
    block: block
  });
  console.log('Boardroom staked CTRL:', boardroomCtrlStaked.output);
//   sdk.util.sumSingleBalance(balances, ctrl, boardroomCtrlStaked.output);

  const boardroomLiftStaked = await sdk.api.abi.call({
    target: boardroom,
    abi: abi['gettotalSupplyShare'],
    block: block
  });
  console.log('Boardroom staked LIFT:', boardroomLiftStaked.output);
//   sdk.util.sumSingleBalance(balances, lift, boardroomLiftStaked.output);

  //ideafund
  let ideaFundAssets = await sdk.api.erc20.balanceOf({
    owner: ideaFund,
    target: lfbtc,
    block
  });
  console.log('IdeaFund lfBTC: ', ideaFundAssets.output);

//   sdk.util.sumSingleBalance(balances, lfbtc, ideaFundAssets.output);
// Couldn't find the price of token at 0xafcE9B78D409bF74980CACF610AFB851BF02F257, assuming a price of 0 for it...
// LFBTC                     0
// Total: 0

//   sdk.util.sumSingleBalance(balances, wbtc, '1000000000000000000');
// WBTC                      568730.00 B
// Total: 568730.00 B

  const stakedLiquidity = await sdk.api.abi.multiCall({
    abi: abi['totalSupply'],
    calls: liquidityPools.map(lp => ({
        target: lp.contract
    })),
    block
  });

  //console.log('Staked Liquidity: ', stakedLiquidity.output);
  //sdk.util.sumMultiBalanceOf(balances, stakedLiquidity);

  return balances;
}

module.exports = {
  name: 'Lift.Kitchen',
  token: 'CTRL',
  category: 'assets',
  start: 1619283600, //GenesisVault.starttime
  tvl
}