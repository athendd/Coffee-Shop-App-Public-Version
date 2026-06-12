import { Text, View, Pressable } from 'react-native'
import React, { useState } from 'react';

interface DetailsInterface {
    description: string;
}

const DescriptionSection = ({description}:DetailsInterface) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View>
        <Text
            className="text-[#242424] text-lg font-[Sora-SemiBold] ml-1"
            >Description
        </Text>

        <View 
            className='p-2'
        >
            <Text numberOfLines={expanded ? undefined : 3}
            className='text-[#A2A2A2] text-xs font-[Sora-Regular]'
            >
                {expanded ? description : `${description.slice(0, 100)}...`}

                <Pressable onPress={() => setExpanded(!expanded)}>
                    <Text 
                        className='text-[#C67C4E] text-xs font-[Sora-Regular] '
                    >
                        {expanded ? ' Read Less' : 'Read More'}
                    </Text>
                </Pressable>
            </Text>
            
        </View>
    </View>
  )
}

export default DescriptionSection