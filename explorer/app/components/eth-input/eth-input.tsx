import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle, Text } from "react-native"
import { observer } from "mobx-react-lite"
import { Input } from 'react-native-elements';

import { web3 } from '../../services/provider';
import ENS from 'ethereum-ens';
import getInputText from '../../utils/eth-input-text';

const ens = new ENS(web3);
const resolveNameToAddr = async (name) => {
	try {
		const resolver = await ens.resolver(name);
		const address = await	resolver.addr();
		return Promise.resolve(address);
	} catch (e) {
		console.error('Error resolving ENS name', e);
		return Promise.resolve(null);
	}
}

  const reverseAddrToName = async (addr) => {
	try {
		const resolver = await ens.resolver(addr);
		const reverseResolver = await resolver.reverseAddr();
		const name = await reverseResolver.name();
		return Promise.resolve(name);
	} catch (e) {
		console.error('Error reverse resolving ENS addr', e);
		return Promise.resolve(null);
	}
}


export interface EthInputProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  callback: Function

  
}

/**
 * Describe your component here
 */
export const EthInput = observer(function EthInput(props: EthInputProps) {
  const [value, setValue] = React.useState("");
  const [errorText, setErrorText] = React.useState("");
  const [labelText, setLabelText] = React.useState("");

  const onChange = async (value: string): Promise<any> => {
    const isEthAddress = web3.utils.isAddress(value);
    const ensNameMatch = await reverseAddrToName(value);
    const ensAddrMatch = await resolveNameToAddr(value);
    let {
      errorText,
      labelText
    } = getInputText({
      value,
      isEthAddress,
      ensNameMatch,
      ensAddrMatch
    });
    setValue(value);
    setErrorText(errorText);
    setLabelText(labelText);
    props.callback(value);
  }

  return (
  <>
  <Input
  textAlign="left"
  onChangeText={value => {
    onChange(value)
  }}
  placeholder='ex. domain.eth or 0xe7410170f87...'
  />
  <Text>{errorText}</Text>
  <Text>{labelText}</Text>
  </>
  )
})
