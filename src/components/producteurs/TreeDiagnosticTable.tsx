import React from 'react';
import { View, Text, Pressable, Platform, StyleSheet, ScrollView } from 'react-native';
import { TextInput } from '../ui';
import { Trash2 } from 'lucide-react-native';
import { colors, spacing, radius, typography } from '../../theme';

interface TreeDiagnosticTableProps {
  arbres: any[];
  updateNested: (field: string, value: any) => void;
}

export default function TreeDiagnosticTable({ arbres, updateNested }: TreeDiagnosticTableProps) {
  const upArbre = (idx: number, field: string, val: any) => {
    const arr = [...arbres];
    arr[idx] = { ...arr[idx], [field]: val };
    updateNested('diagnosticArbres', arr);
  };

  const addArbre = () => {
    updateNested('diagnosticArbres', [
      ...arbres, 
      { id: `arb_${Date.now()}`, nomBotanique: '', nomLocal: '', circonference: '', origine: '', organe: '', utilite: '', decision: '', raisons: '' }
    ]);
  };

  const deleteArbre = (idx: number) => {
    const arr = [...arbres];
    arr.splice(idx, 1);
    updateNested('diagnosticArbres', arr);
  };

  if (Platform.OS === 'web') {
    const webInputStyle = { width: '100%', backgroundColor: '#1a1a1a', border: '1px solid #333', color: '#fff', padding: '6px', borderRadius: '4px', boxSizing: 'border-box' as const, fontSize: '12px', outline: 'none' };
    const getCheckboxStyle = (checked: boolean) => ({ width: 14, height: 14, backgroundColor: '#fff', borderRadius: 2, margin: '0 auto', cursor: 'pointer', position: 'relative' as const });
    const checkboxInnerStyle = { position: 'absolute' as const, top: 2, left: 2, width: 10, height: 10, backgroundColor: '#3b82f6', borderRadius: 1 };

    return (
      <View style={styles.sousSection}>
        <View style={styles.sousSectionHeaderRow}>
          <Text style={styles.sousSectionTitle}>◆ Diagnostic des arbres autres que le cacaoyer sur l'exploitation</Text>
        </View>
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <table style={{ minWidth: 900, width: '100%', borderCollapse: 'collapse', borderSpacing: 0, tableLayout: 'fixed', backgroundColor: '#000', color: '#fff' }}>
            <thead>
              <tr>
                <th rowSpan={2} style={{ border: '1px solid #303030', boxSizing: 'border-box', width: 40, padding: 4, fontSize: 12, textAlign: 'center', backgroundColor: '#000' }}>N°<br/>arbre</th>
                <th colSpan={2} style={{ border: '1px solid #303030', boxSizing: 'border-box', padding: 4, fontSize: 12, textAlign: 'center', backgroundColor: '#000' }}>Arbres forestiers et fruitiers<br/>présents dans la cacaoyère</th>
                <th rowSpan={2} style={{ border: '1px solid #303030', boxSizing: 'border-box', width: 80, padding: 4, fontSize: 12, textAlign: 'center', backgroundColor: '#000' }}>Circonférence<br/>(à hauteur de<br/>poitrine)</th>
                <th colSpan={2} style={{ border: '1px solid #303030', boxSizing: 'border-box', width: 100, padding: 4, fontSize: 12, textAlign: 'center', backgroundColor: '#000' }}>Origine de l'arbre</th>
                <th colSpan={2} style={{ border: '1px solid #303030', boxSizing: 'border-box', padding: 4, fontSize: 12, textAlign: 'center', backgroundColor: '#000' }}>Usage</th>
                <th colSpan={3} style={{ border: '1px solid #303030', boxSizing: 'border-box', padding: 4, fontSize: 12, textAlign: 'center', backgroundColor: '#000' }}>Décision</th>
                <th rowSpan={2} style={{ border: '1px solid #303030', boxSizing: 'border-box', width: 36, backgroundColor: '#000' }}></th>
              </tr>
              <tr>
                <th style={{ border: '1px solid #303030', boxSizing: 'border-box', padding: 4, fontSize: 11, textAlign: 'center', width: '14%', backgroundColor: '#000' }}>Nom botanique</th>
                <th style={{ border: '1px solid #303030', boxSizing: 'border-box', padding: 4, fontSize: 11, textAlign: 'center', width: '14%', backgroundColor: '#000' }}>Nom local</th>
                <th style={{ border: '1px solid #303030', boxSizing: 'border-box', padding: 4, fontSize: 11, textAlign: 'center', width: 50, backgroundColor: '#000' }}>Préservé</th>
                <th style={{ border: '1px solid #303030', boxSizing: 'border-box', padding: 4, fontSize: 11, textAlign: 'center', width: 50, backgroundColor: '#000' }}>Plantés</th>
                <th style={{ border: '1px solid #303030', boxSizing: 'border-box', padding: 4, fontSize: 11, textAlign: 'center', width: '10%', backgroundColor: '#000' }}>Organe utilisé</th>
                <th style={{ border: '1px solid #303030', boxSizing: 'border-box', padding: 4, fontSize: 11, textAlign: 'center', width: '10%', backgroundColor: '#000' }}>Utilité</th>
                <th style={{ border: '1px solid #303030', boxSizing: 'border-box', padding: 4, fontSize: 11, textAlign: 'center', width: 50, backgroundColor: '#000' }}>A<br/>éliminer</th>
                <th style={{ border: '1px solid #303030', boxSizing: 'border-box', padding: 4, fontSize: 11, textAlign: 'center', width: 50, backgroundColor: '#000' }}>A<br/>maintenir</th>
                <th style={{ border: '1px solid #303030', boxSizing: 'border-box', padding: 4, fontSize: 11, textAlign: 'center', width: '12%', backgroundColor: '#000' }}>Raisons</th>
              </tr>
            </thead>
            <tbody>
              {arbres.map((a, i) => (
                <tr key={a.id || i}>
                  <td style={{ border: '1px solid #303030', boxSizing: 'border-box', padding: 4, textAlign: 'center', fontSize: 12, fontWeight: 'bold' }}>{i + 1}</td>
                  <td style={{ border: '1px solid #303030', boxSizing: 'border-box', padding: 4 }}><input type="text" value={a.nomBotanique} onChange={e => upArbre(i, 'nomBotanique', e.target.value)} placeholder="Saisir" style={webInputStyle} /></td>
                  <td style={{ border: '1px solid #303030', boxSizing: 'border-box', padding: 4 }}><input type="text" value={a.nomLocal} onChange={e => upArbre(i, 'nomLocal', e.target.value)} placeholder="Saisir" style={webInputStyle} /></td>
                  <td style={{ border: '1px solid #303030', boxSizing: 'border-box', padding: 4 }}><input type="text" value={a.circonference} onChange={e => upArbre(i, 'circonference', e.target.value)} placeholder="Saisir" style={webInputStyle} /></td>
                  <td style={{ border: '1px solid #303030', boxSizing: 'border-box', padding: 4, textAlign: 'center' }}>
                    <div onClick={() => upArbre(i, 'origine', a.origine === 'Preserve' ? '' : 'Preserve')} style={getCheckboxStyle(a.origine === 'Preserve')}>
                      {a.origine === 'Preserve' && <div style={checkboxInnerStyle} />}
                    </div>
                  </td>
                  <td style={{ border: '1px solid #303030', boxSizing: 'border-box', padding: 4, textAlign: 'center' }}>
                    <div onClick={() => upArbre(i, 'origine', a.origine === 'Plante' ? '' : 'Plante')} style={getCheckboxStyle(a.origine === 'Plante')}>
                      {a.origine === 'Plante' && <div style={checkboxInnerStyle} />}
                    </div>
                  </td>
                  <td style={{ border: '1px solid #303030', boxSizing: 'border-box', padding: 4 }}><input type="text" value={a.organe} onChange={e => upArbre(i, 'organe', e.target.value)} placeholder="Saisir" style={webInputStyle} /></td>
                  <td style={{ border: '1px solid #303030', boxSizing: 'border-box', padding: 4 }}><input type="text" value={a.utilite} onChange={e => upArbre(i, 'utilite', e.target.value)} placeholder="Saisir" style={webInputStyle} /></td>
                  <td style={{ border: '1px solid #303030', boxSizing: 'border-box', padding: 4, textAlign: 'center' }}>
                    <div onClick={() => upArbre(i, 'decision', a.decision === 'Eliminer' ? '' : 'Eliminer')} style={getCheckboxStyle(a.decision === 'Eliminer')}>
                      {a.decision === 'Eliminer' && <div style={checkboxInnerStyle} />}
                    </div>
                  </td>
                  <td style={{ border: '1px solid #303030', boxSizing: 'border-box', padding: 4, textAlign: 'center' }}>
                    <div onClick={() => upArbre(i, 'decision', a.decision === 'Maintenir' ? '' : 'Maintenir')} style={getCheckboxStyle(a.decision === 'Maintenir')}>
                      {a.decision === 'Maintenir' && <div style={checkboxInnerStyle} />}
                    </div>
                  </td>
                  <td style={{ border: '1px solid #303030', boxSizing: 'border-box', padding: 4 }}><input type="text" value={a.raisons} onChange={e => upArbre(i, 'raisons', e.target.value)} placeholder="Saisir" style={webInputStyle} /></td>
                  <td style={{ border: '1px solid #303030', boxSizing: 'border-box', padding: 4, textAlign: 'center' }}>
                    {i >= 10 && (
                      <Pressable onPress={() => deleteArbre(i)} style={({ pressed }) => [{ padding: 4 }, pressed && { opacity: 0.7 }]}>
                        <Trash2 size={16} color="rgba(255,255,255,0.4)" />
                      </Pressable>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pressable onPress={addArbre} style={({ pressed }) => [styles.addMemberBtn, pressed && { backgroundColor: 'rgba(34, 197, 94, 0.1)' }]}>
          <Text style={styles.addMemberBtnText}>+ Ajouter un arbre</Text>
        </Pressable>
      </View>
    );
  }

  // Fallback for native (iOS/Android) using the exact previous logic
  const cellBorder = { borderRightWidth: 1, borderRightColor: '#2f2f2f' };
  const rowBorder = { borderBottomWidth: 1, borderBottomColor: '#2f2f2f' };

  return (
    <View style={styles.sousSection}>
          <View style={styles.sousSectionHeaderRow}>
            <Text style={styles.sousSectionTitle}>◆ Diagnostic des arbres autres que le cacaoyer sur l'exploitation</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.tableScroll}>
            <View style={[styles.tableContainer, { minWidth: 900, flexDirection: 'column', backgroundColor: '#000', borderColor: '#2f2f2f', borderWidth: 1, borderRadius: 8, overflow: 'hidden' }]}>
              {/* Header */}
              <View style={[styles.tableHeader, rowBorder, { width: '100%', backgroundColor: '#000', borderBottomColor: '#2f2f2f' }]}>
                <View style={{ flexDirection: 'row', width: '100%' }}>
                  <View style={[styles.tableCell, cellBorder, { width: 50, justifyContent: 'center', alignItems: 'center' }]}>
                    <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#fff', textAlign: 'center', lineHeight: 14 }}>N°{"\n"}arbre</Text>
                  </View>
                  <View style={[{ flexDirection: 'column', flex: 1.8 }, cellBorder]}>
                    <View style={{ flex: 1, borderBottomWidth: 1, borderBottomColor: '#2f2f2f', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4, paddingVertical: 4 }}>
                      <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#fff', textAlign: 'center', lineHeight: 14 }}>Arbres forestiers et fruitiers{"\n"}présents dans la cacaoyère</Text>
                    </View>
                    <View style={{ flexDirection: 'row', flex: 1 }}>
                      <View style={{ flex: 1, borderRightWidth: 1, borderRightColor: '#2f2f2f', justifyContent: 'center', alignItems: 'center', paddingVertical: 4 }}><Text style={{ fontSize: 11, fontWeight: 'bold', color: '#fff', textAlign: 'center' }}>Nom botanique</Text></View>
                      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 4 }}><Text style={{ fontSize: 11, fontWeight: 'bold', color: '#fff', textAlign: 'center' }}>Nom local</Text></View>
                    </View>
                  </View>
                  <View style={[styles.tableCell, cellBorder, { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 2 }]}>
                    <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#fff', textAlign: 'center', lineHeight: 14 }}>Circonférence{"\n"}(à hauteur de{"\n"}poitrine)</Text>
                  </View>
                  <View style={[{ flexDirection: 'column', width: 140 }, cellBorder]}>
                    <View style={{ flex: 1, borderBottomWidth: 1, borderBottomColor: '#2f2f2f', justifyContent: 'center', alignItems: 'center', paddingVertical: 4 }}>
                      <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#fff', textAlign: 'center' }}>Origine de l'arbre</Text>
                    </View>
                    <View style={{ flexDirection: 'row', flex: 1 }}>
                      <View style={{ width: 70, borderRightWidth: 1, borderRightColor: '#2f2f2f', justifyContent: 'center', alignItems: 'center', paddingVertical: 4 }}><Text style={{ fontSize: 11, fontWeight: 'bold', color: '#fff', textAlign: 'center' }}>Préservé</Text></View>
                      <View style={{ width: 70, justifyContent: 'center', alignItems: 'center', paddingVertical: 4 }}><Text style={{ fontSize: 11, fontWeight: 'bold', color: '#fff', textAlign: 'center' }}>Plantés</Text></View>
                    </View>
                  </View>
                  <View style={[{ flexDirection: 'column', flex: 1.5 }, cellBorder]}>
                    <View style={{ flex: 1, borderBottomWidth: 1, borderBottomColor: '#2f2f2f', justifyContent: 'center', alignItems: 'center', paddingVertical: 4 }}>
                      <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#fff', textAlign: 'center' }}>Usage</Text>
                    </View>
                    <View style={{ flexDirection: 'row', flex: 1 }}>
                      <View style={{ flex: 1, borderRightWidth: 1, borderRightColor: '#2f2f2f', justifyContent: 'center', alignItems: 'center', paddingVertical: 4 }}><Text style={{ fontSize: 11, fontWeight: 'bold', color: '#fff', textAlign: 'center' }}>Organe utilisé</Text></View>
                      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 4 }}><Text style={{ fontSize: 11, fontWeight: 'bold', color: '#fff', textAlign: 'center' }}>Utilité</Text></View>
                    </View>
                  </View>
                  <View style={[{ flexDirection: 'column', flex: 2 }, cellBorder]}>
                    <View style={{ flex: 1, borderBottomWidth: 1, borderBottomColor: '#2f2f2f', justifyContent: 'center', alignItems: 'center', paddingVertical: 4 }}>
                      <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#fff', textAlign: 'center' }}>Décision</Text>
                    </View>
                    <View style={{ flexDirection: 'row', flex: 1 }}>
                      <View style={{ flex: 1, borderRightWidth: 1, borderRightColor: '#2f2f2f', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 2, paddingVertical: 4 }}><Text style={{ fontSize: 11, fontWeight: 'bold', color: '#fff', textAlign: 'center', lineHeight: 12 }}>A{"\n"}éliminer</Text></View>
                      <View style={{ flex: 1, borderRightWidth: 1, borderRightColor: '#2f2f2f', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 2, paddingVertical: 4 }}><Text style={{ fontSize: 11, fontWeight: 'bold', color: '#fff', textAlign: 'center', lineHeight: 12 }}>A{"\n"}maintenir</Text></View>
                      <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center', paddingVertical: 4 }}><Text style={{ fontSize: 11, fontWeight: 'bold', color: '#fff', textAlign: 'center' }}>Raisons</Text></View>
                    </View>
                  </View>
                  <View style={[styles.tableCell, { width: 36, justifyContent: 'center', alignItems: 'center' }]}></View>
                </View>
              </View>

              {/* Lignes Arbres */}
              {arbres.map((a: any, i: number) => (
                <View key={a.id || i} style={[styles.tableRow, rowBorder, { width: '100%', borderBottomWidth: i === arbres.length - 1 ? 0 : 1 }]}>
                  <View style={[styles.tableCell, cellBorder, { width: 50, justifyContent: 'center', alignItems: 'center', padding: 8 }]}>
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 12 }}>{i + 1}</Text>
                  </View>
                  <View style={[{ flexDirection: 'row', flex: 1.8 }, cellBorder]}>
                    <View style={{ flex: 1, borderRightWidth: 1, borderRightColor: '#2f2f2f', justifyContent: 'center', padding: 8 }}><TextInput value={a.nomBotanique} onChangeText={v => upArbre(i, 'nomBotanique', v)} compact placeholder="Saisir" /></View>
                    <View style={{ flex: 1, justifyContent: 'center', padding: 8 }}><TextInput value={a.nomLocal} onChangeText={v => upArbre(i, 'nomLocal', v)} compact placeholder="Saisir" /></View>
                  </View>
                  <View style={[styles.tableCell, cellBorder, { flex: 1, justifyContent: 'center', padding: 8 }]}><TextInput value={a.circonference} onChangeText={v => upArbre(i, 'circonference', v)} keyboardType="numeric" compact placeholder="Saisir" /></View>
                  <View style={[{ flexDirection: 'row', width: 140 }, cellBorder]}>
                    <View style={{ width: 70, justifyContent: 'center', alignItems: 'center', borderRightWidth: 1, borderRightColor: '#2f2f2f', padding: 8 }}>
                      <Pressable onPress={() => upArbre(i, 'origine', a.origine === 'Preserve' ? '' : 'Preserve')} style={{ width: 14, height: 14, backgroundColor: '#fff', borderRadius: 2 }}>
                         {a.origine === 'Preserve' && <View style={{ position: 'absolute', top: 2, left: 2, width: 10, height: 10, backgroundColor: '#3b82f6', borderRadius: 1 }} />}
                      </Pressable>
                    </View>
                    <View style={{ width: 70, justifyContent: 'center', alignItems: 'center', padding: 8 }}>
                      <Pressable onPress={() => upArbre(i, 'origine', a.origine === 'Plante' ? '' : 'Plante')} style={{ width: 14, height: 14, backgroundColor: '#fff', borderRadius: 2 }}>
                         {a.origine === 'Plante' && <View style={{ position: 'absolute', top: 2, left: 2, width: 10, height: 10, backgroundColor: '#3b82f6', borderRadius: 1 }} />}
                      </Pressable>
                    </View>
                  </View>
                  <View style={[{ flexDirection: 'row', flex: 1.5 }, cellBorder]}>
                    <View style={{ flex: 1, borderRightWidth: 1, borderRightColor: '#2f2f2f', justifyContent: 'center', padding: 8 }}><TextInput value={a.organe} onChangeText={v => upArbre(i, 'organe', v)} compact placeholder="Saisir" /></View>
                    <View style={{ flex: 1, justifyContent: 'center', padding: 8 }}><TextInput value={a.utilite} onChangeText={v => upArbre(i, 'utilite', v)} compact placeholder="Saisir" /></View>
                  </View>
                  <View style={[{ flexDirection: 'row', flex: 2 }, cellBorder]}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderRightWidth: 1, borderRightColor: '#2f2f2f', padding: 8 }}>
                      <Pressable onPress={() => upArbre(i, 'decision', a.decision === 'Eliminer' ? '' : 'Eliminer')} style={{ width: 14, height: 14, backgroundColor: '#fff', borderRadius: 2 }}>
                         {a.decision === 'Eliminer' && <View style={{ position: 'absolute', top: 2, left: 2, width: 10, height: 10, backgroundColor: '#3b82f6', borderRadius: 1 }} />}
                      </Pressable>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderRightWidth: 1, borderRightColor: '#2f2f2f', padding: 8 }}>
                      <Pressable onPress={() => upArbre(i, 'decision', a.decision === 'Maintenir' ? '' : 'Maintenir')} style={{ width: 14, height: 14, backgroundColor: '#fff', borderRadius: 2 }}>
                         {a.decision === 'Maintenir' && <View style={{ position: 'absolute', top: 2, left: 2, width: 10, height: 10, backgroundColor: '#3b82f6', borderRadius: 1 }} />}
                      </Pressable>
                    </View>
                    <View style={{ flex: 1.5, justifyContent: 'center', padding: 8 }}><TextInput value={a.raisons} onChangeText={v => upArbre(i, 'raisons', v)} compact placeholder="Saisir" /></View>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
          <Pressable 
            onPress={() => updateNested('diagnosticArbres', [...arbres, { id: `arb_${Date.now()}`, nomBotanique: '', nomLocal: '', circonference: '', origine: '', organe: '', utilite: '', decision: '', raisons: '' }])}
            style={({ pressed }) => [styles.addMemberBtn, pressed && { backgroundColor: 'rgba(34, 197, 94, 0.1)' }]}
          >
            <Text style={styles.addMemberBtnText}>+ Ajouter un arbre</Text>
          </Pressable>
        </View>
  );
}

const styles = StyleSheet.create({
  sousSection: {
    marginBottom: spacing.xl,
  },
  sousSectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sousSectionTitle: {
    color: '#22c55e',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: spacing.xs,
  },
  tableScroll: {
    marginTop: spacing.md,
  },
  tableContainer: {
    flexDirection: 'column',
    borderWidth: 1,
    borderColor: '#2f2f2f',
    borderRadius: 8,
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#2f2f2f',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#000',
  },
  tableCell: {
    padding: spacing.xs,
    justifyContent: 'flex-start',
    flexShrink: 0,
  },
  addMemberBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'transparent',
    borderColor: '#22c55e',
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    marginTop: spacing.md,
  },
  addMemberBtnText: {
    color: '#22c55e',
    fontSize: 12,
    fontWeight: '500',
  },
});
