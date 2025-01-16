import Retell from 'retell-sdk';

const client = new Retell({
  apiKey: 'key_c846e7f3c9c2228a550c9a492b90',
});

export async function makePhoneCall(number: string, carType: string, carYear: string, dealership: string) {
  try {
    const phoneCallResponse = await client.call.createPhoneCall({
      from_number: '+16503768755',
      to_number: number,
      override_agent_id: 'agent_44a6ad13b3985625b2cdfe4a86', 
      retell_llm_dynamic_variables: {
        'cartype': carType,
        'caryear': carYear,
        'dealership': dealership,
      }
    });
    return phoneCallResponse;
  } catch (error) {
    console.error('Error making phone call:', error);
    throw new Error('Failed to make the phone call.');
  }
}

export async function getCall(callId: string) {
  try {
    const phoneCallResponse = await client.call.retrieve(callId);
    return phoneCallResponse;
  } catch (error) {
    console.error('Error getting phone call:', error);
    throw new Error('Failed to get the phone call.');
  }
}

