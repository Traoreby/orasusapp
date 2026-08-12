import React from 'react';
import { View, Text, Platform } from 'react-native';

export interface RigidTableProps {
  headers: { label: string; subLabel?: string; width: string }[];
  subHeaders?: { label: string; width: string; parentIndex: number }[];
  data: any[];
  renderRow: (item: any, index: number) => React.ReactNode;
}

export const RigidTable = ({ headers, subHeaders, data, renderRow }: RigidTableProps) => {
  return (
    <View style={{ width: '100%', borderWidth: 1, borderColor: '#2a2a2a', borderRadius: 0, overflow: 'hidden', boxSizing: 'border-box' as any, marginBottom: 16 }}>
      
      {/* Header */}
      <View style={{ flexDirection: 'row', backgroundColor: '#000', borderBottomWidth: 1, borderBottomColor: '#2a2a2a' }}>
        {headers.map((h, i) => {
          const subs = subHeaders?.filter(sh => sh.parentIndex === i);
          
          if (subs && subs.length > 0) {
            return (
              <View key={i} style={{ width: h.width as any, flexDirection: 'column', boxSizing: 'border-box' as any, borderRightWidth: 1, borderRightColor: '#2a2a2a' }}>
                <View style={{ borderBottomWidth: 1, borderBottomColor: '#2a2a2a', padding: 8, justifyContent: 'center', boxSizing: 'border-box' as any, flex: 1 }}>
                  <Text style={{ color: '#fff', fontSize: 13, fontWeight: 'bold', textAlign: 'center' }}>{h.label}</Text>
                  {h.subLabel && <Text style={{ color: '#d6d3d1', fontSize: 10, textAlign: 'center', marginTop: 2 }}>{h.subLabel}</Text>}
                </View>
                <View style={{ flexDirection: 'row', flex: 1 }}>
                  {subs.map((sh, j) => (
                    <View key={j} style={{ width: sh.width as any, padding: 6, borderRightWidth: j < subs.length - 1 ? 1 : 0, borderRightColor: '#2a2a2a', justifyContent: 'center', boxSizing: 'border-box' as any }}>
                      <Text style={{ color: '#fff', fontSize: 11, fontWeight: 'bold', textAlign: 'center' }}>{sh.label}</Text>
                    </View>
                  ))}
                </View>
              </View>
            );
          }
          
          return (
            <View key={i} style={{ width: h.width as any, padding: 8, borderRightWidth: 1, borderRightColor: '#2a2a2a', justifyContent: 'center', boxSizing: 'border-box' as any }}>
              <Text style={{ color: '#fff', fontSize: 13, fontWeight: 'bold', textAlign: 'center' }}>{h.label}</Text>
              {h.subLabel && <Text style={{ color: '#d6d3d1', fontSize: 10, textAlign: 'center', marginTop: 2 }}>{h.subLabel}</Text>}
            </View>
          );
        })}
      </View>

      {/* Rows */}
      {data.map((item, index) => (
        <View key={index} style={{ flexDirection: 'row', backgroundColor: 'transparent', borderTopWidth: index === 0 ? 0 : 1, borderTopColor: '#2a2a2a', boxSizing: 'border-box' as any }}>
          {renderRow(item, index)}
        </View>
      ))}
    </View>
  );
};
