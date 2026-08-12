import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Alert, KeyboardAvoidingView, Pressable, TextInput as RNTextInput, Dimensions, Modal, ActivityIndicator } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { calculateFicheCompletion } from '../../utils/pdcCompletion';
import { Producteur } from '../../core/types/producteur';
import TreeDiagnosticTable from './TreeDiagnosticTable';
import { Button, Card, TextInput, Select, Divider, RigidTable } from '../ui';
import { spacing, typography, radius } from '../../theme';
import { useTheme } from '../../hooks/useTheme';
import { FICHE1_FIELDS } from '../../constants/fiche1Fields';
import { REGIONS, DEPARTEMENTS, ENTITES, STATUT_FAMILLE, STATUT_PLANTATION, STATUT_SCOLAIRE, NIVEAU_INSTRUCTION, CATEGORIE_ETHNIQUE } from '../../constants/data';
import { User, MapPin, Sprout, TrendingUp, AlertTriangle, Calendar, Banknote, Trash2, Save, Star, Check, Plus , Eye, Printer} from 'lucide-react-native';

interface ProducteurFormProps {
  initialData: Producteur;
  onSubmit?: (data: Producteur) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  mode?: 'edit' | 'pdc';
  onAutoSave?: (data: Producteur) => void;
  onPrint?: () => void;
  onPreview?: () => void;
  onChangeProducteur?: () => void;
  savingState?: 'idle' | 'saving' | 'saved';
}

const SECTIONS = [
  { id: 0, label: 'ANNEXE 1 : COLLECTE DES DONNÉES', type: 'separator' },
  { id: 1, label: 'Profil et Ménage', icon: User },
  { id: 2, label: 'Exploitation', icon: MapPin },
  { id: 3, label: 'Cacaoyère', icon: Sprout },
  { id: 4, label: 'Profil socio-éco', icon: TrendingUp },
  { id: 0, label: 'ANNEXE 2 : ANALYSE DES DONNÉES', type: 'separator' },
  { id: 5, label: 'Analyse problèmes', icon: AlertTriangle },
  { id: 6, displayId: '6-7', label: 'Planification', icon: Calendar },
  { id: 7, displayId: 8, label: 'Moyens/Coûts', icon: Banknote },
];


const CacaoAppInput = React.forwardRef(({ label, value, onChangeText, keyboardType = 'default', placeholder = 'Saisir', multiline = false, numberOfLines = 1, height = 'auto', error }: any, ref: any) => {
  const [isFocused, React_useState] = React.useState(false);
  return (
    <View style={{ width: '100%' }}>
      {label ? (
        <Text style={{ fontSize: 12, fontWeight: '500', color: '#a8a29e', marginBottom: 4 }}>
          {label}
        </Text>
      ) : null}
      <RNTextInput
        ref={ref}
        value={String(value || '')}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        placeholder={placeholder}
        placeholderTextColor="#57534e"
        multiline={multiline}
        numberOfLines={numberOfLines}
        onFocus={() => React_useState(true)}
        onBlur={() => React_useState(false)}
        style={{
          width: '100%',
          paddingHorizontal: 8,
          paddingVertical: 6,
          backgroundColor: 'rgba(41, 37, 36, 0.5)',
          borderWidth: 1,
          borderColor: error ? '#ef4444' : isFocused ? 'rgba(22, 163, 74, 0.5)' : 'rgba(68, 64, 60, 0.4)',
          borderRadius: 8,
          fontSize: 14,
          color: '#fff',
          height: multiline && height === 'auto' ? 60 : height,
          textAlignVertical: multiline ? 'top' : 'center',
          ...(Platform.OS === 'web' ? { outlineStyle: 'none' } as any : {})
        }}
      />
      {error ? <Text style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>⚠ {error}</Text> : null}
    </View>
  );
});

const CacaoAppSelect = React.forwardRef(({ label, value, onValueChange, options, error }: any, ref: any) => {
  const [isFocused, React_useState] = React.useState(false);
  const [isHovered, setHovered] = React.useState(false);
  
  if (Platform.OS === 'web') {
    return (
      <View style={{ width: '100%' }}>
        <Text style={{ fontSize: 12, fontWeight: '500', color: '#a8a29e', marginBottom: 4 }}>
          {label}
        </Text>
        <div 
          style={{ position: 'relative' }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <select
            ref={ref}
            value={value || ''}
            onChange={(e) => onValueChange(e.target.value)}
            onFocus={() => React_useState(true)}
            onBlur={() => React_useState(false)}
            style={{
              width: '100%',
              padding: '6px 8px',
              backgroundColor: 'rgba(41, 37, 36, 0.5)',
              border: `1px solid ${error ? '#ef4444' : (isFocused ? 'rgba(22, 163, 74, 0.5)' : 'rgba(68, 64, 60, 0.4)')}`,
              borderRadius: '8px',
              color: '#fff',
              fontSize: '14px',
              fontFamily: 'inherit',
              appearance: 'none',
              outline: 'none',
              cursor: 'pointer',
              transition: 'border-color 0.2s ease'
            }}
          >
            <option value="" disabled style={{ color: '#57534e' }}>Sélectionner...</option>
            {options.map((opt: any) => (
              <option key={opt} value={opt} style={{ backgroundColor: '#292524', color: '#fff' }}>{opt}</option>
            ))}
          </select>
          <div style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a8a29e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </div>
        {error ? <Text style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>⚠ {error}</Text> : null}
      </View>
    );
  }
  
  // For mobile, fallback to the ui Select component
  return (
    <View ref={ref} style={{ width: '100%' }}>
      <Select 
        label={label}
        value={value}
        onValueChange={onValueChange}
        options={options.map((o: any) => ({ label: o, value: o }))}
        compact
        error={error}
      />
    </View>
  );
});

const PERIODE_COLORS: { color: string; label: string }[] = [
  { color: '#22c55e', label: 'Plantation / Création' },
  { color: '#f97316', label: 'Entretien / Taille' },
  { color: '#3b82f6', label: 'Traitement phytosanitaire' },
  { color: '#eab308', label: 'Récolte / Autre' },
];

export const ProducteurForm = React.forwardRef<any, ProducteurFormProps>(({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
  mode = 'edit',
  onAutoSave,
  onPrint,
  onPreview,
  onChangeProducteur,
  savingState = 'idle'
}, ref) => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => getStyles(colors), [colors]);
  const [data, setData] = useState<Producteur>(initialData);
  const [lastSavedData, setLastSavedData] = useState<string>(JSON.stringify(initialData));

  const dataRef = useRef(data);
  dataRef.current = data;

  React.useEffect(() => {
    if (mode === 'pdc' && onAutoSave) {
      const timer = setTimeout(() => {
        const currentDataStr = JSON.stringify(dataRef.current);
        if (currentDataStr !== lastSavedData) {
          onAutoSave(dataRef.current);
          setLastSavedData(currentDataStr);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [data, mode, onAutoSave, lastSavedData]);

  React.useImperativeHandle(ref, () => ({
    forceSaveAsync: async () => {
      const currentDataStr = JSON.stringify(dataRef.current);
      if (currentDataStr !== lastSavedData && onAutoSave) {
        onAutoSave(dataRef.current);
        setLastSavedData(currentDataStr);
        await new Promise(r => setTimeout(r, 600)); // wait for fake API
      }
    }
  }));
  
  // Importer la complétion
  // (assurez-vous d'ajouter cet import en haut du fichier si besoin, ou on l'appellera inline)

  const isNewProducteur = !initialData.nom && !initialData.codeNational;
  const [highestSectionVisited, setHighestSectionVisited] = useState(isNewProducteur ? 1 : 7);
  const [activeSection, setActiveSection] = useState(1);
  const [pickerKey, setPickerKey] = useState<string | null>(null); // color picker for Fiche 6 periods
  const scrollViewRef = useRef<ScrollView>(null);

  const update = (field: keyof Producteur, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const updateNested = (path: string, value: any) => {
    setData(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let obj = copy;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!obj[keys[i]]) obj[keys[i]] = {};
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return copy;
    });
  };

  const [errors, setErrors] = useState<Record<string, string>>({});
  const fieldRefs = useRef<Record<string, any>>({});

  const validateAllFields = (): boolean => {
    const requiredFields = [
      { id: 'nom', section: 1 },
      { id: 'contact', section: 1 },
      { id: 'codeNational', section: 1 },
      { id: 'codeGroupe', section: 1 },
      { id: 'nomEntite', section: 1 },
      { id: 'codeEntite', section: 1 },
    ];
    
    const missing = requiredFields.filter(f => !String((data as any)[f.id] || '').trim());
    
    if (missing.length > 0) {
      const firstMissing = missing[0];
      
      const newErrors: Record<string, string> = {};
      missing.forEach(f => {
        newErrors[f.id] = 'Ce champ est obligatoire';
      });
      setErrors(newErrors);

      setActiveSection(firstMissing.section);
      
      setTimeout(() => {
        const ref = fieldRefs.current[firstMissing.id];
        if (ref && ref.focus) {
          ref.focus();
        }
      }, 100);

      return false;
    }
    setErrors({});
    return true;
  };

  const validateCurrentSection = (): boolean => {
    if (activeSection === 1) {
      const requiredFields = FICHE1_FIELDS.filter(f => f.required).map(f => f.id);
      const missing = requiredFields.filter(id => !String((data as any)[id] || '').trim());
      
      if (missing.length > 0) {
        const newErrors: Record<string, string> = {};
        missing.forEach(id => {
          newErrors[id] = 'Ce champ est obligatoire';
        });
        setErrors(newErrors);
        
        setTimeout(() => {
          const ref = fieldRefs.current[missing[0]];
          if (ref && ref.focus) {
            ref.focus();
          }
        }, 100);
        return false;
      }
    }
    setErrors({});
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentSection()) {
      return;
    }

    if (activeSection < 7) {
      setActiveSection(prev => {
        const next = prev + 1;
        setHighestSectionVisited(h => Math.max(h, next));
        return next;
      });
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }
  };

  const handlePrev = () => {
    if (activeSection > 1) {
      setActiveSection(prev => prev - 1);
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }
  };

  const handleSubmit = () => {
    if (!validateAllFields()) {
      return;
    }
    onSubmit?.(data);
  };

  const removeMenage = (index: number) => {
    updateNested('menage', (data.menage || []).filter((_: any, i: number) => i !== index));
  };

  const renderFiche1 = () => (
    <View style={styles.ficheContainer}>
      <View style={styles.ficheHeader}>
        <Text style={styles.ficheAnnexeTitle}><Text style={{color: "#ef4444"}}>◆</Text> Annexe 1 : Outils de collecte des données</Text>
        <Text style={styles.ficheMainTitle}><Text style={{color: "#3b82f6"}}>◆</Text> FICHE 1 — PROFIL DU PRODUCTEUR ET DU MENAGE</Text>
      </View>
      
      <View style={styles.sousSection}>
        <Text style={styles.sousSectionTitle}>Sous-section 1 : Identification du producteur</Text>
        <Text style={styles.requiredNotice}>Les champs marqués <Text style={styles.requiredStar}>*</Text> sont obligatoires.</Text>
        
        <View style={styles.gridContainer}>
          {FICHE1_FIELDS.reduce((result: any[], field, index, array) => {
            if (index % 2 === 0) {
              result.push(array.slice(index, index + 2));
            }
            return result;
          }, []).map((rowFields, rowIndex) => (
            <View key={rowIndex} style={styles.gridRow}>
              {rowFields.map((field: any) => (
                <View key={field.id} style={styles.gridCol}>
                  {field.type === 'select' ? (
                    <Select 
                      ref={(r: any) => { fieldRefs.current[field.id] = r; }}
                      label={field.label} 
                      required={field.required} 
                      value={(data as any)[field.id] || ''} 
                      onValueChange={v => {
                        update(field.id as any, v);
                        if (field.id === 'delegation') update('departement', '');
                        if (errors[field.id]) {
                          setErrors(prev => { const n = {...prev}; delete n[field.id]; return n; });
                        }
                      }}
                      options={field.optionsSource === 'ENTITES' ? ENTITES.map(e => ({label: e, value: e})) :
                               field.optionsSource === 'REGIONS' ? REGIONS.map(r => ({label: r, value: r})) :
                               field.optionsSource === 'DEPARTEMENTS' ? (DEPARTEMENTS[data.delegation || ''] || []).map(d => ({label: d, value: d})) : []}
                      disabled={field.dependsOn ? !(data as any)[field.dependsOn] : false}
                      error={errors[field.id]}
                    />
                  ) : (
                    <TextInput 
                      ref={(r: any) => { fieldRefs.current[field.id] = r; }}
                      label={field.label} 
                      required={field.required} 
                      value={(data as any)[field.id] || ''} 
                      onChangeText={v => {
                        update(field.id as any, v);
                        if (errors[field.id]) {
                          setErrors(prev => { const n = {...prev}; delete n[field.id]; return n; });
                        }
                      }} 
                      keyboardType={field.type === 'phone' ? 'phone-pad' : 'default'}
                      error={errors[field.id]}
                    />
                  )}
                </View>
              ))}
              {rowFields.length === 1 && <View style={styles.gridCol}></View>}
            </View>
          ))}
        </View>
      </View>
      
      <View style={styles.sousSection}>
        <View style={styles.sousSectionHeaderRow}>
          <Text style={styles.sousSectionTitle}>Sous-section 2 : Information sur le ménage</Text>
        </View>
        
                <View style={{ width: '100%', overflow: 'hidden' }}>
          <View style={[styles.tableContainer, { flexDirection: 'column', width: '100%', minWidth: '100%' }]}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCell, styles.tableHeaderCell, { width: '16%', fontSize: 12, paddingVertical: 8, paddingHorizontal: 6, boxSizing: 'border-box' }]}>Nom</Text>
              <Text style={[styles.tableCell, styles.tableHeaderCell, { width: '11%', fontSize: 12, paddingVertical: 8, paddingHorizontal: 6, boxSizing: 'border-box' }]}>Statut/Famille¹</Text>
              <Text style={[styles.tableCell, styles.tableHeaderCell, { width: '11%', fontSize: 12, paddingVertical: 8, paddingHorizontal: 6, boxSizing: 'border-box' }]}>Statut/Plantation²</Text>
              <Text style={[styles.tableCell, styles.tableHeaderCell, { width: '11%', fontSize: 12, paddingVertical: 8, paddingHorizontal: 6, boxSizing: 'border-box' }]}>Statut Scolaire³</Text>
              <Text style={[styles.tableCell, styles.tableHeaderCell, { width: '12%', fontSize: 12, paddingVertical: 8, paddingHorizontal: 6, boxSizing: 'border-box' }]}>Contact</Text>
              <Text style={[styles.tableCell, styles.tableHeaderCell, { width: '8%', fontSize: 12, paddingVertical: 8, paddingHorizontal: 6, boxSizing: 'border-box' }]}>Année naiss.</Text>
              <Text style={[styles.tableCell, styles.tableHeaderCell, { width: '6%', fontSize: 12, paddingVertical: 8, paddingHorizontal: 6, boxSizing: 'border-box' }]}>Sexe</Text>
              <Text style={[styles.tableCell, styles.tableHeaderCell, { width: '11%', fontSize: 12, paddingVertical: 8, paddingHorizontal: 6, boxSizing: 'border-box' }]}>Niveau instr.⁴</Text>
              <Text style={[styles.tableCell, styles.tableHeaderCell, { width: '11%', fontSize: 12, paddingVertical: 8, paddingHorizontal: 6, boxSizing: 'border-box' }]}>Ethnie⁵</Text>
              <View style={[styles.tableCell, styles.tableHeaderCell, { width: '3%', borderRightWidth: 0, boxSizing: 'border-box' }]}></View>
            </View>
          
            {(data.menage || []).map((m: any, i: number) => (
              <View key={i} style={styles.tableRow}>
                <View style={[styles.tableCell, { width: '16%', padding: 4, boxSizing: 'border-box', justifyContent: 'center' }]}>
                  <TextInput value={m.nom} onChangeText={v => { const arr = [...(data.menage||[])]; arr[i].nom = v; update('menage', arr); }} style={{ fontSize: 12, paddingVertical: 6, paddingHorizontal: 4 }} />
                </View>
              <View style={[styles.tableCell, { width: '11%', padding: 4, boxSizing: 'border-box', justifyContent: 'center' }]}>
                <Select value={m.statutFamille || ''} onValueChange={v => { const arr = [...(data.menage||[])]; arr[i].statutFamille = v; update('menage', arr); }} options={STATUT_FAMILLE.map(o => ({label: o, value: o}))} style={{ paddingVertical: 6, paddingHorizontal: 4 }} />
              </View>
              <View style={[styles.tableCell, { width: '11%', padding: 4, boxSizing: 'border-box', justifyContent: 'center' }]}>
                <Select value={m.statutPlantation || ''} onValueChange={v => { const arr = [...(data.menage||[])]; arr[i].statutPlantation = v; update('menage', arr); }} options={STATUT_PLANTATION.map(o => ({label: o, value: o}))} style={{ paddingVertical: 6, paddingHorizontal: 4 }} />
              </View>
              <View style={[styles.tableCell, { width: '11%', padding: 4, boxSizing: 'border-box', justifyContent: 'center' }]}>
                <Select value={m.statutScolaire || ''} onValueChange={v => { const arr = [...(data.menage||[])]; arr[i].statutScolaire = v; update('menage', arr); }} options={STATUT_SCOLAIRE.map(o => ({label: o, value: o}))} style={{ paddingVertical: 6, paddingHorizontal: 4 }} />
              </View>
              <View style={[styles.tableCell, { width: '12%', padding: 4, boxSizing: 'border-box', justifyContent: 'center' }]}>
                <TextInput value={m.contact} onChangeText={v => { const arr = [...(data.menage||[])]; arr[i].contact = v; update('menage', arr); }} keyboardType="phone-pad" placeholder="Tél" style={{ fontSize: 12, paddingVertical: 6, paddingHorizontal: 4 }} />
              </View>
              <View style={[styles.tableCell, { width: '8%', padding: 4, boxSizing: 'border-box', justifyContent: 'center' }]}>
                <TextInput value={m.anneeNaissance?.toString()} onChangeText={v => { const arr = [...(data.menage||[])]; arr[i].anneeNaissance = parseInt(v) || ''; update('menage', arr); }} keyboardType="numeric" style={{ fontSize: 12, paddingVertical: 6, paddingHorizontal: 4 }} />
              </View>
              <View style={[styles.tableCell, { width: '6%', padding: 4, boxSizing: 'border-box', justifyContent: 'center' }]}>
                <Select value={m.sexe || ''} onValueChange={v => { const arr = [...(data.menage||[])]; arr[i].sexe = v; update('menage', arr); }} options={[{label: 'M', value: 'M'}, {label: 'F', value: 'F'}]} style={{ paddingVertical: 6, paddingHorizontal: 4 }} />
              </View>
              <View style={[styles.tableCell, { width: '11%', padding: 4, boxSizing: 'border-box', justifyContent: 'center' }]}>
                <Select value={m.niveauInstruction || ''} onValueChange={v => { const arr = [...(data.menage||[])]; arr[i].niveauInstruction = v; update('menage', arr); }} options={NIVEAU_INSTRUCTION.map(o => ({label: o, value: o}))} style={{ paddingVertical: 6, paddingHorizontal: 4 }} />
              </View>
              <View style={[styles.tableCell, { width: '11%', padding: 4, boxSizing: 'border-box', justifyContent: 'center' }]}>
                <Select value={m.categorieEthnique || ''} onValueChange={v => { const arr = [...(data.menage||[])]; arr[i].categorieEthnique = v; update('menage', arr); }} options={CATEGORIE_ETHNIQUE.map(o => ({label: o, value: o}))} style={{ paddingVertical: 6, paddingHorizontal: 4 }} />
              </View>
              <View style={[styles.tableCell, { width: '3%', borderRightWidth: 0, justifyContent: 'center', alignItems: 'center', boxSizing: 'border-box', padding: 4 }]}>
                <Pressable onPress={() => removeMenage(i)} style={({ pressed }) => [{ padding: 4, borderRadius: 4 }, pressed && { opacity: 0.7 }]}>
                  <Trash2 size={14} color="rgba(255,255,255,0.4)" />
                </Pressable>
              </View>
            </View>
          ))}
          </View>
        </View>
        <Pressable 
          onPress={() => update('menage', [...(data.menage || []), { nom:'', statutFamille:'', statutPlantation:'', statutScolaire:'', contact:'', anneeNaissance:'', sexe:'', niveauInstruction:'', categorieEthnique:'' }])}
          style={({ pressed }) => [styles.addMemberBtn, pressed && { backgroundColor: 'rgba(22, 163, 74, 0.25)' }]}
        >
          <Text style={styles.addMemberBtnText}>+ Ajouter un membre</Text>
        </Pressable>
      </View>
    </View>
  );

  const renderFiche2 = () => {
    const cultures = data.donneesCultures && data.donneesCultures.length > 0 ? data.donneesCultures : [
      { id: 'c1', libelle: 'Champs 1', annee: '', precedent: '', sup: '', origine: '', enProduction: '', isAutre: false },
      { id: 'c2', libelle: 'Champs 2', annee: '', precedent: '', sup: '', origine: '', enProduction: '', isAutre: false },
      { id: 'c3', libelle: 'Champs 3', annee: '', precedent: '', sup: '', origine: '', enProduction: '', isAutre: false },
      { id: 'a1', libelle: '', annee: '', precedent: '', sup: '', origine: '', enProduction: '', isAutre: true },
      { id: 'a2', libelle: '', annee: '', precedent: '', sup: '', origine: '', enProduction: '', isAutre: true },
    ];

    const materiels = data.materiels && data.materiels.length > 0 ? data.materiels : [
      { id: 'm1', type: 'Matériel de traitement', rowSpan: 3, designation: 'Pulvérisateur', qte: '', annee: '', cout: '', bon: '', acc: '', mauv: '' },
      { id: 'm2', designation: 'Atomiseur', qte: '', annee: '', cout: '', bon: '', acc: '', mauv: '' },
      { id: 'm3', designation: 'EPI', qte: '', annee: '', cout: '', bon: '', acc: '', mauv: '' },
      { id: 'm4', type: 'Matériel de transport', rowSpan: 3, designation: 'Tricycle', qte: '', annee: '', cout: '', bon: '', acc: '', mauv: '' },
      { id: 'm5', designation: 'Brouette', qte: '', annee: '', cout: '', bon: '', acc: '', mauv: '' },
      { id: 'm6', designation: 'Camion/camionnette', qte: '', annee: '', cout: '', bon: '', acc: '', mauv: '' },
      { id: 'm7', type: 'Moyen de déplacement', rowSpan: 3, designation: 'Vélo', qte: '', annee: '', cout: '', bon: '', acc: '', mauv: '' },
      { id: 'm8', designation: 'Moto', qte: '', annee: '', cout: '', bon: '', acc: '', mauv: '' },
      { id: 'm9', designation: 'Voiture', qte: '', annee: '', cout: '', bon: '', acc: '', mauv: '' },
      { id: 'm10', type: 'Matériel de séchage', rowSpan: 3, designation: 'Claie/séco', qte: '', annee: '', cout: '', bon: '', acc: '', mauv: '' },
      { id: 'm11', designation: 'Aire cimentée', qte: '', annee: '', cout: '', bon: '', acc: '', mauv: '' },
      { id: 'm12', designation: 'Séchoir solaire', qte: '', annee: '', cout: '', bon: '', acc: '', mauv: '' },
      { id: 'm13', type: 'Matériel de fermentation', rowSpan: 1, designation: 'Bac de fermentation', qte: '', annee: '', cout: '', bon: '', acc: '', mauv: '' },
      { id: 'm14', type: 'Petit outillage', rowSpan: 2, designation: 'Machette, émondoir,', qte: '', annee: '', cout: '', bon: '', acc: '', mauv: '' },
      { id: 'm15', designation: 'Matériel de récolte', qte: '', annee: '', cout: '', bon: '', acc: '', mauv: '' },
      { id: 'm16', type: 'Autres', rowSpan: 3, designation: 'Tronçonneuse', qte: '', annee: '', cout: '', bon: '', acc: '', mauv: '' },
      { id: 'm17', designation: '......', qte: '', annee: '', cout: '', bon: '', acc: '', mauv: '' },
      { id: 'm18', designation: '......', qte: '', annee: '', cout: '', bon: '', acc: '', mauv: '' },
    ];

    const arbres = data.diagnosticArbres && data.diagnosticArbres.length > 0 ? data.diagnosticArbres : Array.from({ length: 10 }).map((_, i) => ({
      id: `arb_${i+1}`, nomBotanique: '', nomLocal: '', circonference: '', origine: '', organe: '', utilite: '', decision: '', raisons: ''
    }));

    const upCult = (index: number, field: string, val: any) => {
      const arr = [...cultures];
      arr[index] = { ...arr[index], [field]: val };
      updateNested('donneesCultures', arr);
    };

    const upMat = (index: number, field: string, val: any) => {
      const arr = [...materiels];
      arr[index] = { ...arr[index], [field]: val };
      updateNested('materiels', arr);
    };

    const upArbre = (index: number, field: string, val: any) => {
      const arr = [...arbres];
      arr[index] = { ...arr[index], [field]: val };
      updateNested('diagnosticArbres', arr);
    };

    const cellBorder = { borderRightWidth: 1, borderRightColor: '#2a2a2a' };
    const rowBorder = { borderBottomWidth: 1, borderBottomColor: '#2a2a2a' };

    return (
      <View style={styles.ficheContainer}>
        <View style={styles.ficheHeader}>
          <Text style={styles.ficheMainTitle}><Text style={{color: "#3b82f6"}}>◆</Text> FICHE 2 : PROFIL DE L'EXPLOITATION</Text>
        </View>
        {/* 1. Coordonnées Géographiques */}
        <View style={styles.sousSection}>
          <View style={styles.sousSectionHeaderRow}>
            <Text style={styles.sousSectionTitle}>◆ Coordonnées Géographiques de la cacaoyère</Text>
          </View>
          <View style={[styles.tableContainer, { flexDirection: 'column', minWidth: '100%', paddingHorizontal: spacing.xl, paddingVertical: spacing.lg, gap: spacing.lg, backgroundColor: '#0a0a0a', borderColor: '#2a2a2a', borderWidth: 1, borderRadius: 8 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ color: '#fff', fontSize: 13, fontWeight: 'bold', width: 90 }}>Waypoints</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: spacing.xl, flex: 1 }}>
                <Text style={{ color: colors.textSecondary, fontSize: 13, marginRight: spacing.sm }}>O :</Text>
                <View style={{ flex: 1 }}>
                  <TextInput value={data.coordonnees?.waypointO} onChangeText={v => updateNested('coordonnees.waypointO', v)} compact placeholder="Saisir" />
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <Text style={{ color: colors.textSecondary, fontSize: 13, marginRight: spacing.sm }}>N :</Text>
                <View style={{ flex: 1 }}>
                  <TextInput value={data.coordonnees?.waypointN} onChangeText={v => updateNested('coordonnees.waypointN', v)} compact placeholder="Saisir" />
                </View>
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <Text style={{ color: colors.textSecondary, fontSize: 13, marginRight: spacing.sm }}>Sous/préfecture :</Text>
                <View style={{ flex: 1 }}>
                  <TextInput value={data.coordonnees?.sousPrefecture} onChangeText={v => updateNested('coordonnees.sousPrefecture', v)} compact placeholder="Saisir" />
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <Text style={{ color: colors.textSecondary, fontSize: 13, marginRight: spacing.sm }}>Village :</Text>
                <View style={{ flex: 1 }}>
                  <TextInput value={data.coordonnees?.village} onChangeText={v => updateNested('coordonnees.village', v)} compact placeholder="Saisir" />
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <Text style={{ color: colors.textSecondary, fontSize: 13, marginRight: spacing.sm }}>Campement :</Text>
                <View style={{ flex: 1 }}>
                  <TextInput value={data.coordonnees?.campement} onChangeText={v => updateNested('coordonnees.campement', v)} compact placeholder="Saisir" />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* 2. Données sur les cultures */}
        <View style={styles.sousSection}>
          <View style={styles.sousSectionHeaderRow}>
            <Text style={styles.sousSectionTitle}>◆ Données sur les cultures</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tableScroll} contentContainerStyle={{ minWidth: '100%' }}>
            <View style={[styles.tableContainer, { flexDirection: 'column', width: '100%', minWidth: 600, backgroundColor: '#000', borderColor: '#2a2a2a', borderWidth: 1, borderRadius: 8, overflow: 'hidden' }]}>
              {/* Header */}
              <View style={[styles.tableHeader, rowBorder, { width: '100%', minWidth: 600, backgroundColor: '#000' }]}>
                <View style={{ flexDirection: 'row', width: '100%' }}>
                  <View style={[styles.tableCell, cellBorder, { flex: 1.5, minWidth: 80, height: 60, justifyContent: 'center', alignItems: 'center' }]}><Text style={{ fontSize: 12, fontWeight: 'bold', color: '#fff', textAlign: 'center' }}>Libellé</Text></View>
                  <View style={[styles.tableCell, cellBorder, { flex: 1.2, minWidth: 100, height: 60, justifyContent: 'center', alignItems: 'center' }]}><Text style={{ fontSize: 12, fontWeight: 'bold', color: '#fff', textAlign: 'center' }}>Année de création</Text></View>
                  <View style={[styles.tableCell, cellBorder, { flex: 1.2, minWidth: 100, height: 60, justifyContent: 'center', alignItems: 'center' }]}><Text style={{ fontSize: 12, fontWeight: 'bold', color: '#fff', textAlign: 'center' }}>Précédent cultural</Text></View>
                  <View style={[styles.tableCell, cellBorder, { flex: 0.8, minWidth: 80, height: 60, justifyContent: 'center', alignItems: 'center' }]}><Text style={{ fontSize: 12, fontWeight: 'bold', color: '#fff', textAlign: 'center' }}>Sup. (ha)</Text></View>
                  <View style={[styles.tableCell, cellBorder, { flex: 1.5, minWidth: 80, height: 60, justifyContent: 'center', alignItems: 'center' }]}><Text style={{ fontSize: 12, fontWeight: 'bold', color: '#fff', textAlign: 'center' }}>Origine matériel végétal</Text></View>
                  <View style={[{ flexDirection: 'column', width: 140 }, cellBorder]}>
                    <View style={{ width: 140, height: 36, borderBottomWidth: 1, borderBottomColor: '#2a2a2a', justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontSize: 11, fontWeight: 'bold', color: '#fff', textAlign: 'center' }}>Le champs est-il en production</Text></View>
                    <View style={{ flexDirection: 'row' }}>
                      <View style={{ width: 70, height: 24, borderRightWidth: 1, borderRightColor: '#2a2a2a', justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontSize: 11, fontWeight: 'bold', color: '#fff', textAlign: 'center' }}>Oui</Text></View>
                      <View style={{ width: 70, height: 24, justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontSize: 11, fontWeight: 'bold', color: '#fff', textAlign: 'center' }}>Non</Text></View>
                    </View>
                  </View>
                  <View style={[styles.tableCell, { width: 50, height: 60, justifyContent: 'center', alignItems: 'center' }]}></View>
                </View>
              </View>

              {/* Cacao Group */}
              <View style={[styles.tableRow, rowBorder, { backgroundColor: '#1a1a1a', width: '100%', minWidth: 600 }]}>
                <View style={[styles.tableCell, { flex: 1, justifyContent: 'center', paddingVertical: 10 }]}><Text style={{ fontWeight: 'bold', color: '#fff', fontSize: 13, marginLeft: 12 }}>Cacao</Text></View>
              </View>
              {cultures.map((c: any, i: number) => !c.isAutre && (
                <View key={c.id || i} style={[styles.tableRow, rowBorder, { width: '100%', minWidth: 600, backgroundColor: 'transparent' }]}>
                  <View style={[styles.tableCell, cellBorder, { flex: 1.5, minWidth: 80, justifyContent: 'center', padding: 8 }]}><Text style={{ color: '#fff', fontSize: 13, fontWeight: 'bold' }}>{c.libelle}</Text></View>
                  <View style={[styles.tableCell, cellBorder, { flex: 1.2, minWidth: 100, justifyContent: 'center', padding: 8 }]}><TextInput value={c.annee} onChangeText={v => upCult(i, 'annee', v)} keyboardType="numeric" compact placeholder="Saisir" /></View>
                  <View style={[styles.tableCell, cellBorder, { flex: 1.2, minWidth: 100, justifyContent: 'center', padding: 8 }]}><TextInput value={c.precedent} onChangeText={v => upCult(i, 'precedent', v)} compact placeholder="Saisir" /></View>
                  <View style={[styles.tableCell, cellBorder, { flex: 0.8, minWidth: 80, justifyContent: 'center', padding: 8 }]}><TextInput value={String(c.sup || '')} onChangeText={v => upCult(i, 'sup', v)} keyboardType="decimal-pad" compact placeholder="Saisir" /></View>
                  <View style={[styles.tableCell, cellBorder, { flex: 1.5, minWidth: 80, justifyContent: 'center', padding: 8 }]}><TextInput value={c.origine} onChangeText={v => upCult(i, 'origine', v)} compact placeholder="Saisir" /></View>
                  <View style={[styles.tableCell, { width: 70, justifyContent: 'center', alignItems: 'center', borderRightWidth: 1, borderRightColor: '#2a2a2a', padding: 8 }]}>
                    <Pressable onPress={() => upCult(i, 'enProduction', c.enProduction === 'Oui' ? '' : 'Oui')} style={{ width: 18, height: 18, borderWidth: 1, borderColor: '#fff', backgroundColor: c.enProduction === 'Oui' ? '#fff' : 'transparent', borderRadius: 2 }} />
                  </View>
                  <View style={[styles.tableCell, cellBorder, { width: 70, justifyContent: 'center', alignItems: 'center', padding: 8 }]}>
                    <Pressable onPress={() => upCult(i, 'enProduction', c.enProduction === 'Non' ? '' : 'Non')} style={{ width: 18, height: 18, borderWidth: 1, borderColor: '#fff', backgroundColor: c.enProduction === 'Non' ? '#fff' : 'transparent', borderRadius: 2 }} />
                  </View>
                  <View style={[styles.tableCell, { width: 50, padding: 8 }]}></View>
                </View>
              ))}

              {/* Autres Cultures Group */}
              <View style={[styles.tableRow, rowBorder, { backgroundColor: '#115e59', width: '100%', minWidth: 600 }]}>
                <View style={[styles.tableCell, { flex: 1, justifyContent: 'center', paddingVertical: 10 }]}><Text style={{ fontWeight: 'bold', color: '#fff', fontSize: 13, marginLeft: 12 }}>Autres cultures</Text></View>
              </View>
              {cultures.map((c: any, i: number) => c.isAutre && (
                <View key={c.id || i} style={[styles.tableRow, rowBorder, { width: '100%', minWidth: 600, backgroundColor: 'transparent', borderBottomWidth: i === cultures.length - 1 ? 0 : 1 }]}>
                  <View style={[styles.tableCell, cellBorder, { flex: 1.5, minWidth: 80, justifyContent: 'center', padding: 8 }]}><TextInput value={c.libelle} onChangeText={v => upCult(i, 'libelle', v)} compact placeholder="Saisir" /></View>
                  <View style={[styles.tableCell, cellBorder, { flex: 1.2, minWidth: 100, justifyContent: 'center', padding: 8 }]}><TextInput value={c.annee} onChangeText={v => upCult(i, 'annee', v)} keyboardType="numeric" compact placeholder="Saisir" /></View>
                  <View style={[styles.tableCell, cellBorder, { flex: 1.2, minWidth: 100, justifyContent: 'center', padding: 8 }]}><TextInput value={c.precedent} onChangeText={v => upCult(i, 'precedent', v)} compact placeholder="Saisir" /></View>
                  <View style={[styles.tableCell, cellBorder, { flex: 0.8, minWidth: 80, justifyContent: 'center', padding: 8 }]}><TextInput value={String(c.sup || '')} onChangeText={v => upCult(i, 'sup', v)} keyboardType="decimal-pad" compact placeholder="Saisir" /></View>
                  <View style={[styles.tableCell, cellBorder, { flex: 1.5, minWidth: 80, justifyContent: 'center', padding: 8 }]}><TextInput value={c.origine} onChangeText={v => upCult(i, 'origine', v)} compact placeholder="Saisir" /></View>
                  <View style={[styles.tableCell, { width: 70, justifyContent: 'center', alignItems: 'center', borderRightWidth: 1, borderRightColor: '#2a2a2a', padding: 8 }]}>
                    <Pressable onPress={() => upCult(i, 'enProduction', c.enProduction === 'Oui' ? '' : 'Oui')} style={{ width: 18, height: 18, borderWidth: 1, borderColor: '#fff', backgroundColor: c.enProduction === 'Oui' ? '#fff' : 'transparent', borderRadius: 2 }} />
                  </View>
                  <View style={[styles.tableCell, cellBorder, { width: 70, justifyContent: 'center', alignItems: 'center', padding: 8 }]}>
                    <Pressable onPress={() => upCult(i, 'enProduction', c.enProduction === 'Non' ? '' : 'Non')} style={{ width: 18, height: 18, borderWidth: 1, borderColor: '#fff', backgroundColor: c.enProduction === 'Non' ? '#fff' : 'transparent', borderRadius: 2 }} />
                  </View>
                  <View style={[styles.tableCell, { width: 50, justifyContent: 'center', alignItems: 'center', padding: 8 }]}>
                    {i >= 3 && (
                      <Pressable onPress={() => { const arr = [...cultures]; arr.splice(i,1); updateNested('donneesCultures', arr); }} style={({ pressed }) => [{ padding: 8 }, pressed && { opacity: 0.7 }]}>
                        <Trash2 size={16} color="rgba(255,255,255,0.4)" />
                      </Pressable>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
          <Pressable 
            onPress={() => updateNested('donneesCultures', [...cultures, { id: Date.now().toString(), libelle: '', annee: '', precedent: '', sup: '', origine: '', enProduction: '', isAutre: true }])}
            style={({ pressed }) => [styles.addMemberBtn, pressed && { backgroundColor: 'rgba(34, 197, 94, 0.1)' }]}
          >
            <Text style={styles.addMemberBtnText}>+ Ajouter une ligne (Autres cultures)</Text>
          </Pressable>
        </View>

        {/* 3. Matériels agricoles */}
        <View style={styles.sousSection}>
          <View style={styles.sousSectionHeaderRow}>
            <Text style={styles.sousSectionTitle}>◆ Matériels agricoles/Equipements de travail (mettre dans l'ordre)</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tableScroll} contentContainerStyle={{ minWidth: '100%' }}>
            <View style={[styles.tableContainer, { flexDirection: 'column', width: '100%', minWidth: 700, backgroundColor: '#000', borderColor: '#2a2a2a', borderWidth: 1, borderRadius: 8, overflow: 'hidden' }]}>
              {/* Header */}
              <View style={[styles.tableHeader, rowBorder, { width: '100%', minWidth: 700, backgroundColor: '#000' }]}>
                <View style={{ flexDirection: 'row', width: '100%' }}>
                  {/* Left Column Fixed Width */}
                  <View style={[styles.tableCell, cellBorder, { width: 160, height: 48, justifyContent: 'center', alignItems: 'center' }]}><Text style={{ fontSize: 12, fontWeight: 'bold', color: '#fff', textAlign: 'center' }}>Type</Text></View>
                  
                  {/* Right Wrapper Flex */}
                  <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View style={[styles.tableCell, cellBorder, { flex: 1, minWidth: 100, height: 48, justifyContent: 'center', alignItems: 'center' }]}><Text style={{ fontSize: 12, fontWeight: 'bold', color: '#fff', textAlign: 'center' }}>Désignation</Text></View>
                    <View style={[styles.tableCell, cellBorder, { width: 100, height: 48, justifyContent: 'center', alignItems: 'center' }]}><Text style={{ fontSize: 12, fontWeight: 'bold', color: '#fff', textAlign: 'center' }}>Quantité</Text></View>
                    <View style={[styles.tableCell, cellBorder, { width: 140, height: 48, justifyContent: 'center', alignItems: 'center' }]}><Text style={{ fontSize: 12, fontWeight: 'bold', color: '#fff', textAlign: 'center' }}>Année d'acquisition</Text></View>
                    <View style={[styles.tableCell, cellBorder, { width: 100, height: 48, justifyContent: 'center', alignItems: 'center' }]}><Text style={{ fontSize: 12, fontWeight: 'bold', color: '#fff', textAlign: 'center' }}>Coût</Text></View>
                    <View style={[{ flexDirection: 'column', width: 240 }, cellBorder]}>
                      <View style={{ width: 240, height: 24, borderBottomWidth: 1, borderBottomColor: '#2a2a2a', justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontSize: 11, fontWeight: 'bold', color: '#fff', textAlign: 'center' }}>Etat (précisez le nombre)</Text></View>
                      <View style={{ flexDirection: 'row' }}>
                        <View style={{ width: 80, height: 24, borderRightWidth: 1, borderRightColor: '#2a2a2a', justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontSize: 11, fontWeight: 'bold', color: '#fff', textAlign: 'center' }}>Bon</Text></View>
                        <View style={{ width: 80, height: 24, borderRightWidth: 1, borderRightColor: '#2a2a2a', justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontSize: 11, fontWeight: 'bold', color: '#fff', textAlign: 'center' }}>Acceptable</Text></View>
                        <View style={{ width: 80, height: 24, justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontSize: 11, fontWeight: 'bold', color: '#fff', textAlign: 'center' }}>Mauvais</Text></View>
                      </View>
                    </View>
                    <View style={[styles.tableCell, { width: 60, height: 48, justifyContent: 'center', alignItems: 'center' }]}></View>
                  </View>
                </View>
              </View>

              {/* Lignes Matériels */}
              {(() => {
                const materielGroups: any[] = [];
                let currentGroup: any = null;
                materiels.forEach((m: any, index: number) => {
                  if (m.type !== undefined) {
                    if (currentGroup) materielGroups.push(currentGroup);
                    currentGroup = { type: m.type, isCustomType: m.isCustomType, groupId: m.groupId, items: [{...m, originalIndex: index}] };
                  } else if (currentGroup) {
                    currentGroup.items.push({...m, originalIndex: index});
                  } else {
                    materielGroups.push({ items: [{...m, originalIndex: index}] });
                  }
                });
                if (currentGroup) materielGroups.push(currentGroup);

                return materielGroups.map((group, gIndex) => {
                  return (
                    <View key={gIndex} style={[{ flexDirection: 'row', width: '100%', minWidth: 700 }, gIndex < materielGroups.length - 1 && rowBorder]}>
                      {/* Left Cell (Type with rowSpan) */}
                      {group.type !== undefined ? (
                        <View style={[styles.tableCell, cellBorder, { width: 160, backgroundColor: '#18181b', justifyContent: 'center', alignItems: 'center', padding: 8 }]}>
                          {group.isCustomType ? (
                            <TextInput value={group.type} onChangeText={v => upMat(group.items[0].originalIndex, 'type', v)} placeholder="Type" compact />
                          ) : (
                            <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold', textAlign: 'center' }}>{group.type}</Text>
                          )}
                        </View>
                      ) : (
                        <View style={[styles.tableCell, cellBorder, { width: 160, backgroundColor: '#000' }]}></View>
                      )}
                      
                      {/* Right Column (Rows inside the group) */}
                      <View style={{ flex: 1, flexDirection: 'column' }}>
                        {group.items.map((m: any, i: number) => (
                          <View key={m.id || i} style={[{ flexDirection: 'row', width: '100%' }, i < group.items.length - 1 && rowBorder]}>
                            <View style={[styles.tableCell, cellBorder, { flex: 1, minWidth: 100, justifyContent: 'center', padding: 8 }]}>
                              {m.designation === '......' ? (
                                <TextInput value={m.designationValue || ''} onChangeText={v => upMat(m.originalIndex, 'designationValue', v)} placeholder="Préciser" compact />
                              ) : m.isCustomRow ? (
                                <TextInput value={m.designation || ''} onChangeText={v => upMat(m.originalIndex, 'designation', v)} placeholder="Désignation" compact />
                              ) : (
                                <Text style={{ color: '#fff', fontSize: 13, fontWeight: 'bold' }}>{m.designation}</Text>
                              )}
                            </View>
                            <View style={[styles.tableCell, cellBorder, { width: 100, justifyContent: 'center', padding: 8 }]}><TextInput value={m.qte} onChangeText={v => upMat(m.originalIndex, 'qte', v)} keyboardType="numeric" compact placeholder="Saisir" /></View>
                            <View style={[styles.tableCell, cellBorder, { width: 140, justifyContent: 'center', padding: 8 }]}><TextInput value={m.annee} onChangeText={v => upMat(m.originalIndex, 'annee', v)} keyboardType="numeric" compact placeholder="Saisir" /></View>
                            <View style={[styles.tableCell, cellBorder, { width: 100, justifyContent: 'center', padding: 8 }]}><TextInput value={m.cout} onChangeText={v => upMat(m.originalIndex, 'cout', v)} keyboardType="numeric" compact placeholder="Saisir" /></View>
                            <View style={[styles.tableCell, cellBorder, { width: 80, justifyContent: 'center', padding: 8 }]}><TextInput value={m.bon} onChangeText={v => upMat(m.originalIndex, 'bon', v)} keyboardType="numeric" compact placeholder="Qté" /></View>
                            <View style={[styles.tableCell, cellBorder, { width: 80, justifyContent: 'center', padding: 8 }]}><TextInput value={m.acc} onChangeText={v => upMat(m.originalIndex, 'acc', v)} keyboardType="numeric" compact placeholder="Qté" /></View>
                            <View style={[styles.tableCell, cellBorder, { width: 80, justifyContent: 'center', padding: 8 }]}><TextInput value={m.mauv} onChangeText={v => upMat(m.originalIndex, 'mauv', v)} keyboardType="numeric" compact placeholder="Qté" /></View>
                            <View style={[styles.tableCell, { width: 60, justifyContent: 'center', alignItems: 'center', padding: 8 }]}>
                              {m.groupId && m.type !== undefined && i === 0 && (
                                <Pressable onPress={() => updateNested('materiels', materiels.filter((x: any) => x.groupId !== m.groupId))} style={({ pressed }) => [{ padding: 8 }, pressed && { opacity: 0.7 }]}>
                                  <Trash2 size={16} color="rgba(255,255,255,0.4)" />
                                </Pressable>
                              )}
                            </View>
                          </View>
                        ))}
                      </View>
                    </View>
                  );
                });
              })()}
            </View>
          </ScrollView>
          <Pressable 
            onPress={() => {
              const ts = Date.now().toString();
              updateNested('materiels', [
                ...materiels,
                { id: `m_new_1_${ts}`, groupId: ts, type: '', rowSpan: 3, designation: '', qte: '', annee: '', cout: '', bon: '', acc: '', mauv: '', isCustomType: true, isCustomRow: true },
                { id: `m_new_2_${ts}`, groupId: ts, designation: '', qte: '', annee: '', cout: '', bon: '', acc: '', mauv: '', isCustomRow: true },
                { id: `m_new_3_${ts}`, groupId: ts, designation: '', qte: '', annee: '', cout: '', bon: '', acc: '', mauv: '', isCustomRow: true },
              ]);
            }}
            style={({ pressed }) => [styles.addMemberBtn, pressed && { backgroundColor: 'rgba(34, 197, 94, 0.1)' }]}
          >
            <Text style={styles.addMemberBtnText}>+ Ajouter un nouveau type</Text>
          </Pressable>
        </View>

                {/* 4. Diagnostic des arbres (Extracté) */}
        <TreeDiagnosticTable arbres={data.diagnosticArbres || []} updateNested={updateNested} />
</View>
    );
  };

  const renderFiche3 = () => {

  const emballagesReponse = data.emballagesReponse || '';
  const upEmb = (v: any) => updateNested('emballagesReponse', v);


  const EMPTY_ENGRAIS = () => ({ type: '', nom: '', qte: '', periode: '', mode: '', applicateur: '' });
  const engrais = data.applicationEngrais && data.applicationEngrais.length > 0 ? data.applicationEngrais : [EMPTY_ENGRAIS(), EMPTY_ENGRAIS()];
  const upEngrais = (idx: number, field: string, val: any) => {
    const arr = [...engrais];
    arr[idx] = { ...arr[idx], [field]: val };
    updateNested('applicationEngrais', arr);
  };
  const rmEngrais = (idx: number) => updateNested('applicationEngrais', engrais.filter((_: any, i: number) => i !== idx));
  const addEngrais = () => updateNested('applicationEngrais', [...engrais, EMPTY_ENGRAIS()]);

  const EMPTY_PHYTO = () => ({ type: '', nom: '', qte: '', periode: '', mode: '', applicateur: '' });
  const phyto = data.applicationPhyto && data.applicationPhyto.length > 0 ? data.applicationPhyto : [EMPTY_PHYTO(), EMPTY_PHYTO()];
  const upPhyto = (idx: number, field: string, val: any) => {
    const arr = [...phyto];
    arr[idx] = { ...arr[idx], [field]: val };
    updateNested('applicationPhyto', arr);
  };
  const rmPhyto = (idx: number) => updateNested('applicationPhyto', phyto.filter((_: any, i: number) => i !== idx));
  const addPhyto = () => updateNested('applicationPhyto', [...phyto, EMPTY_PHYTO()]);


  const SOL_LEFT_FIXES = ['Couvert végétal', 'Présence de Matière organique', 'Profondeur', 'Texture', 'Hydromorphie'];
  const SOL_RIGHT_FIXES = [
    { nom: 'Existence de zones érodées', hint: 'transport de matière organique, Ravinements ...' },
    { nom: 'Existence de zones à risque d’érosion', hint: 'Pente, Absence de couvert' },
  ];
  const solGauche = data.solGauche && data.solGauche.length > 0 ? data.solGauche : SOL_LEFT_FIXES.map(nom => ({ nom, valeur: '', observations: '' }));
  const solDroite = data.solDroite && data.solDroite.length > 0 ? data.solDroite : [
    ...SOL_RIGHT_FIXES.map(r => ({ nom: r.nom, hint: r.hint, valeur: '', observations: '' })),
    { nom: '', hint: 'Elément d’observation...', valeur: '', observations: '' },
    { nom: '', hint: 'Elément d’observation...', valeur: '', observations: '' },
    { nom: '', hint: 'Elément d’observation...', valeur: '', observations: '' },
  ];
  const upSolGauche = (idx: number, field: string, val: any) => {
    const arr = [...solGauche];
    arr[idx] = { ...arr[idx], [field]: val };
    updateNested('solGauche', arr);
  };
  const upSolDroite = (idx: number, field: string, val: any) => {
    const arr = [...solDroite];
    arr[idx] = { ...arr[idx], [field]: val };
    updateNested('solDroite', arr);
  };


  const SEVERITE_OPTS = ['1.Aucun', '2.Faible', '3.Moyen', '4.Fort'];
  const MALADIES_FIXES = [
    'Attaques de mirides',
    'Attaques de Pourriture Brune',
    'Présence de plantes épiphytes',
    'Attaque Foreurs',
    'Attaque CSSVD',
    'Autres (Précisez)*',
  ];
  const PARAMS_FIXES = [
    'Présence de gourmands',
    'Présence de cabosses momifiées',
    'Présence de loranthus',
    'Enherbement',
    '',
    '',
  ];

  const maladiesRows = data.maladiesRows && data.maladiesRows.length > 0 ? data.maladiesRows : MALADIES_FIXES.map(nom => ({ nom, severite: '', observations: '' }));
  const parametresRows = data.parametresRows && data.parametresRows.length > 0 ? data.parametresRows : PARAMS_FIXES.map(nom => ({ nom, valeur: '', observations: '' }));

  const upMaladieRow = (idx: number, field: string, val: any) => {
    const arr = [...maladiesRows];
    arr[idx] = { ...arr[idx], [field]: val };
    updateNested('maladiesRows', arr);
  };
  const upParamRow = (idx: number, field: string, val: any) => {
    const arr = [...parametresRows];
    arr[idx] = { ...arr[idx], [field]: val };
    updateNested('parametresRows', arr);
  };

    return (
    <View style={{ padding: 16 }}>
        <Text style={styles.ficheMainTitle}><Text style={{color: "#3b82f6"}}>◆</Text> FICHE 3 : INFORMATIONS SUR LA CACAOYERE</Text>
        <View style={{ width: '100%', backgroundColor: '#1a1a1a', borderRadius: 8, padding: 16, marginBottom: 24, boxSizing: 'border-box' as any }}>
      <View style={styles.sousSectionHeaderRow}>
        <Text style={styles.sousSectionTitle}>❖ Etat de la cacaoyère</Text>
      </View>
      
                        <View style={{
        backgroundColor: 'rgba(28, 25, 23, 0.7)',
        borderWidth: 1,
        borderColor: 'rgba(34, 197, 94, 0.15)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        ...(Platform.OS === 'web' ? { backdropFilter: 'blur(12px)' } as any : {})
      }}>
        <View style={{
          flexDirection: Platform.OS === 'web' && Dimensions.get('window').width > 768 ? 'row' : 'column',
          gap: 16,
        }}>
          {/* Colonne gauche */}
          <View style={{ flex: 1, gap: 16 }}>
            <CacaoAppSelect 
              label="Dispositif de plantation" 
              value={data.cacaoyere?.dispositif} 
              onValueChange={(v: any) => updateNested('cacaoyere.dispositif', v)} 
              options={['En lignes', 'En désordre']} 
            />
            <CacaoAppInput 
              label="Nombre moyen de tiges/cacaoyer" 
              value={data.cacaoyere?.tiges} 
              onChangeText={(v: any) => updateNested('cacaoyere.tiges', v)} 
              keyboardType="numeric" 
            />
            <CacaoAppInput 
              label="Étendue des plages vides" 
              value={data.cacaoyere?.etenduePlages} 
              onChangeText={(v: any) => updateNested('cacaoyere.etenduePlages', v)} 
            />
            <CacaoAppSelect 
              label="Canopée" 
              value={data.cacaoyere?.canopee} 
              onValueChange={(v: any) => updateNested('cacaoyere.canopee', v)} 
              options={['Normal', 'Peu dégradé', 'Dégradé']} 
            />
          </View>

          {/* Colonne droite */}
          <View style={{ flex: 1, gap: 16 }}>
            <CacaoAppInput 
              label="Densité des arbres" 
              value={data.cacaoyere?.densite} 
              onChangeText={(v: any) => updateNested('cacaoyere.densite', v)} 
              keyboardType="number-pad" 
            />
            <CacaoAppSelect 
              label="Plages vides" 
              value={data.cacaoyere?.plagesVides} 
              onValueChange={(v: any) => updateNested('cacaoyere.plagesVides', v)} 
              options={['Peu (≤5)', 'Beaucoup (>5)']} 
            />
            <CacaoAppSelect 
              label="Ombrage" 
              value={data.cacaoyere?.ombrage} 
              onValueChange={(v: any) => updateNested('cacaoyere.ombrage', v)} 
              options={['Inexistant', 'Moyen', 'Dense']} 
            />
          </View>
        </View>
      </View>
      
      {/* ── Tableau Maladies/Ravageurs & Paramètres ── */}
      <View style={{ width: '100%', borderWidth: 1, borderColor: 'rgba(68, 64, 60, 0.5)', borderRadius: 12, overflow: 'hidden', marginBottom: 8 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', backgroundColor: '#000', borderBottomWidth: 1, borderBottomColor: 'rgba(68, 64, 60, 0.5)' }}>
          {/* Bloc Gauche */}
          <View style={{ width: '16%', padding: 8, borderRightWidth: 1, borderRightColor: 'rgba(68, 64, 60, 0.5)', justifyContent: 'center', boxSizing: 'border-box' as any }}>
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold', textAlign: 'center' }}>Élément(s) d'observation</Text>
          </View>
          <View style={{ width: '13%', padding: 8, borderRightWidth: 1, borderRightColor: 'rgba(68, 64, 60, 0.5)', justifyContent: 'center', boxSizing: 'border-box' as any }}>
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold', textAlign: 'center' }}>Valeur</Text>
            <Text style={{ color: '#d6d3d1', fontSize: 10, textAlign: 'center', marginTop: 2 }}>1.Beaucoup / 2.Moyen / 3.Faible</Text>
          </View>
          <View style={{ width: '20%', padding: 8, borderRightWidth: 1, borderRightColor: 'rgba(68, 64, 60, 0.5)', justifyContent: 'center', boxSizing: 'border-box' as any }}>
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold', textAlign: 'center' }}>Observations</Text>
          </View>
          {/* Séparateur Central */}
          <View style={{ width: '2%', backgroundColor: 'rgba(21, 128, 61, 0.6)', boxSizing: 'border-box' as any }} />
          {/* Bloc Droit */}
          <View style={{ width: '16%', padding: 8, borderRightWidth: 1, borderRightColor: 'rgba(68, 64, 60, 0.5)', justifyContent: 'center', boxSizing: 'border-box' as any }}>
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold', textAlign: 'center' }}>Élément(s) d'observation</Text>
          </View>
          <View style={{ width: '13%', padding: 8, borderRightWidth: 1, borderRightColor: 'rgba(68, 64, 60, 0.5)', justifyContent: 'center', boxSizing: 'border-box' as any }}>
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold', textAlign: 'center' }}>Valeur</Text>
            <Text style={{ color: '#d6d3d1', fontSize: 10, textAlign: 'center', marginTop: 2 }}>1.Oui / 2.Non</Text>
          </View>
          <View style={{ width: '20%', padding: 8, justifyContent: 'center', boxSizing: 'border-box' as any }}>
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold', textAlign: 'center' }}>Observations</Text>
          </View>
        </View>

        {/* Body Rows */}
        {maladiesRows.map((m: any, i: number) => (
          <View key={i} style={{ flexDirection: 'row', borderBottomWidth: i < 5 ? 1 : 0, borderBottomColor: 'rgba(68, 64, 60, 0.5)', backgroundColor: 'transparent', boxSizing: 'border-box' as any }}>
            {/* Colonne 1: Maladie */}
            <View style={{ width: '17%', padding: 6, borderRightWidth: 1, borderRightColor: 'rgba(68, 64, 60, 0.5)', justifyContent: 'center', boxSizing: 'border-box' as any }}>
              {i === 5 ? (
                <CacaoAppInput value={m.nom} onChangeText={(v: any) => upMaladieRow(i, 'nom', v)} placeholder="Préciser..." />
              ) : (
                <Text style={{ color: '#e7e5e4', fontSize: 13, fontWeight: '500' }}>{m.nom}</Text>
              )}
            </View>
            {/* Colonne 2: Sévérité */}
            <View style={{ width: '12%', padding: 6, borderRightWidth: 1, borderRightColor: 'rgba(68, 64, 60, 0.5)', justifyContent: 'center', boxSizing: 'border-box' as any }}>
              <CacaoAppSelect value={m.severite} onValueChange={(v: any) => upMaladieRow(i, 'severite', v)} options={SEVERITE_OPTS} />
            </View>
            {/* Colonne 3: Observations */}
            <View style={{ width: '20%', padding: 6, borderRightWidth: 1, borderRightColor: 'rgba(68, 64, 60, 0.5)', justifyContent: 'center', boxSizing: 'border-box' as any }}>
              <CacaoAppInput value={m.observations} onChangeText={(v: any) => upMaladieRow(i, 'observations', v)} placeholder="Saisir" />
            </View>
            {/* Séparateur */}
            <View style={{ width: '2%', backgroundColor: 'rgba(21, 128, 61, 0.6)', boxSizing: 'border-box' as any }} />
            {/* Colonne 4: Paramètre */}
            <View style={{ width: '17%', padding: 6, borderRightWidth: 1, borderRightColor: 'rgba(68, 64, 60, 0.5)', justifyContent: 'center', boxSizing: 'border-box' as any }}>
              {i >= 4 ? (
                <CacaoAppInput value={parametresRows[i]?.nom} onChangeText={(v: any) => upParamRow(i, 'nom', v)} placeholder="Paramètre..." />
              ) : (
                <Text style={{ color: '#e7e5e4', fontSize: 13, fontWeight: '500' }}>{parametresRows[i]?.nom}</Text>
              )}
            </View>
            {/* Colonne 5: Valeur */}
            <View style={{ width: '12%', padding: 6, borderRightWidth: 1, borderRightColor: 'rgba(68, 64, 60, 0.5)', justifyContent: 'center', boxSizing: 'border-box' as any }}>
              <CacaoAppSelect value={parametresRows[i]?.valeur} onValueChange={(v: any) => upParamRow(i, 'valeur', v)} options={SEVERITE_OPTS} />
            </View>
            {/* Colonne 6: Observations */}
            <View style={{ width: '20%', padding: 6, justifyContent: 'center', boxSizing: 'border-box' as any }}>
              <CacaoAppInput value={parametresRows[i]?.observations} onChangeText={(v: any) => upParamRow(i, 'observations', v)} placeholder="Saisir" />
            </View>
          </View>
        ))}
      </View>
      <Text style={{ fontSize: 12, color: '#a8a29e', marginBottom: 24 }}>
        * Décrire les symptômes au cas où la maladie/ <Text style={{ color: '#f87171', fontWeight: '600' }}>le</Text> ravageur n'est pas connu
      </Text>

      {/* ── État du sol ── */}
      <View style={styles.sousSectionHeaderRow}>
        <Text style={styles.sousSectionTitle}>❖ État du sol</Text>
      </View>

      {/* Positionnement de la parcelle */}
      <View style={{
        backgroundColor: 'rgba(28, 25, 23, 0.7)',
        borderWidth: 1,
        borderColor: 'rgba(34, 197, 94, 0.15)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 12,
        ...(Platform.OS === 'web' ? { backdropFilter: 'blur(12px)' } as any : {})
      }}>
        <Text style={{ fontSize: 14, fontWeight: '500', color: '#d6d3d1' }}>Positionnement de la parcelle :</Text>
        <View style={{ width: 250 }}>
          <CacaoAppSelect 
            value={data.positionParcelle} 
            onValueChange={(v: any) => updateNested('positionParcelle', v)} 
            options={['1.Haut de pente', '2.Mi versant', '3.Bas de pente']} 
          />
        </View>
      </View>

      {/* Grand Tableau État du Sol */}
      <View style={{ width: '100%', borderWidth: 1, borderColor: 'rgba(68, 64, 60, 0.5)', borderRadius: 12, overflow: 'hidden', marginBottom: 24 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', backgroundColor: '#000', borderBottomWidth: 1, borderBottomColor: 'rgba(68, 64, 60, 0.5)' }}>
          {/* Bloc Gauche */}
          <View style={{ flex: 1.2, padding: 8, borderRightWidth: 1, borderRightColor: 'rgba(68, 64, 60, 0.5)', justifyContent: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold', textAlign: 'center' }}>Élément(s) d'observation</Text>
          </View>
          <View style={{ flex: 1, padding: 8, borderRightWidth: 1, borderRightColor: 'rgba(68, 64, 60, 0.5)', justifyContent: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold', textAlign: 'center' }}>Valeur</Text>
            <Text style={{ color: '#d6d3d1', fontSize: 10, textAlign: 'center', marginTop: 2 }}>1.Beaucoup / 2.Moyen / 3.Faible</Text>
          </View>
          <View style={{ flex: 1.2, padding: 8, borderRightWidth: 1, borderRightColor: 'rgba(68, 64, 60, 0.5)', justifyContent: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold', textAlign: 'center' }}>Observations</Text>
          </View>
          {/* Séparateur Central */}
          <View style={{ width: 4, backgroundColor: 'rgba(21, 128, 61, 0.6)' }} />
          {/* Bloc Droit */}
          <View style={{ flex: 1.2, padding: 8, borderRightWidth: 1, borderRightColor: 'rgba(68, 64, 60, 0.5)', justifyContent: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold', textAlign: 'center' }}>Élément(s) d'observation</Text>
          </View>
          <View style={{ flex: 1, padding: 8, borderRightWidth: 1, borderRightColor: 'rgba(68, 64, 60, 0.5)', justifyContent: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold', textAlign: 'center' }}>Valeur</Text>
            <Text style={{ color: '#d6d3d1', fontSize: 10, textAlign: 'center', marginTop: 2 }}>1.Oui / 2.Non</Text>
          </View>
          <View style={{ flex: 1.2, padding: 8, justifyContent: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold', textAlign: 'center' }}>Observations</Text>
          </View>
        </View>

        {/* Body Rows */}
        {solGauche.map((row: any, i: number) => (
          <View key={i} style={{ flexDirection: 'row', borderBottomWidth: i < 4 ? 1 : 0, borderBottomColor: 'rgba(68, 64, 60, 0.5)', backgroundColor: 'transparent', boxSizing: 'border-box' as any }}>
            {/* Gauche - Nom */}
            <View style={{ width: '16%', padding: 6, borderRightWidth: 1, borderRightColor: 'rgba(68, 64, 60, 0.5)', justifyContent: 'flex-start', boxSizing: 'border-box' as any }}>
              <Text style={{ color: '#e7e5e4', fontSize: 13, fontWeight: '500', marginTop: 6 }}>{row.nom}</Text>
            </View>
            {/* Gauche - Valeur */}
            <View style={{ width: '13%', padding: 6, borderRightWidth: 1, borderRightColor: 'rgba(68, 64, 60, 0.5)', justifyContent: 'flex-start', boxSizing: 'border-box' as any }}>
              <CacaoAppSelect value={row.valeur} onValueChange={(v: any) => upSolGauche(i, 'valeur', v)} options={['1.Beaucoup', '2.Moyen', '3.Faible']} />
            </View>
            {/* Gauche - Observations (Textarea Inline) */}
            <View style={{ width: '20%', padding: 6, borderRightWidth: 1, borderRightColor: 'rgba(68, 64, 60, 0.5)', justifyContent: 'flex-start', boxSizing: 'border-box' as any }}>
              <RNTextInput
                value={row.observations}
                onChangeText={(v: any) => upSolGauche(i, 'observations', v)}
                placeholder="Saisir"
                placeholderTextColor="#57534e"
                multiline={true}
                numberOfLines={3}
                style={{
                  width: '100%',
                  paddingHorizontal: 8,
                  paddingVertical: 6,
                  backgroundColor: 'rgba(41, 37, 36, 0.5)',
                  borderWidth: 1,
                  borderColor: 'rgba(68, 64, 60, 0.4)',
                  borderRadius: 8,
                  fontSize: 14,
                  color: '#fff',
                  height: 60,
                  textAlignVertical: 'top',
                  boxSizing: 'border-box' as any,
                  ...(Platform.OS === 'web' ? { outlineStyle: 'none', resize: 'vertical' } as any : {})
                }}
              />
            </View>
            {/* Séparateur Central */}
            <View style={{ width: '2%', backgroundColor: 'rgba(21, 128, 61, 0.6)', boxSizing: 'border-box' as any }} />
            {/* Droite - Nom */}
            <View style={{ width: '16%', padding: 6, borderRightWidth: 1, borderRightColor: 'rgba(68, 64, 60, 0.5)', justifyContent: 'flex-start', boxSizing: 'border-box' as any }}>
              {i >= 2 ? (
                <RNTextInput
                  value={solDroite[i]?.nom}
                  onChangeText={(v: any) => upSolDroite(i, 'nom', v)}
                  placeholder="Elément d’observation..."
                  placeholderTextColor="#57534e"
                  multiline={true}
                  numberOfLines={3}
                  style={{
                    width: '100%',
                    paddingHorizontal: 8,
                    paddingVertical: 6,
                    backgroundColor: 'rgba(41, 37, 36, 0.5)',
                    borderWidth: 1,
                    borderColor: 'rgba(68, 64, 60, 0.4)',
                    borderRadius: 8,
                    fontSize: 14,
                    color: '#fff',
                    height: 60,
                    textAlignVertical: 'top',
                    boxSizing: 'border-box' as any,
                    ...(Platform.OS === 'web' ? { outlineStyle: 'none', resize: 'vertical' } as any : {})
                  }}
                />
              ) : (
                <Text style={{ color: '#e7e5e4', fontSize: 13, fontWeight: '500', marginTop: 6 }}>{solDroite[i]?.nom}</Text>
              )}
            </View>
            {/* Droite - Valeur */}
            <View style={{ width: '13%', padding: 6, borderRightWidth: 1, borderRightColor: 'rgba(68, 64, 60, 0.5)', justifyContent: 'flex-start', boxSizing: 'border-box' as any }}>
              <CacaoAppSelect value={solDroite[i]?.valeur} onValueChange={(v: any) => upSolDroite(i, 'valeur', v)} options={['1.Oui', '2.Non']} />
            </View>
            {/* Droite - Observations (Textarea Inline) */}
            <View style={{ width: '20%', padding: 6, justifyContent: 'flex-start', boxSizing: 'border-box' as any }}>
              <RNTextInput
                value={solDroite[i]?.observations}
                onChangeText={(v: any) => upSolDroite(i, 'observations', v)}
                placeholder={solDroite[i]?.hint || "Saisir"}
                placeholderTextColor="#57534e"
                multiline={true}
                numberOfLines={3}
                style={{
                  width: '100%',
                  paddingHorizontal: 8,
                  paddingVertical: 6,
                  backgroundColor: 'rgba(41, 37, 36, 0.5)',
                  borderWidth: 1,
                  borderColor: 'rgba(68, 64, 60, 0.4)',
                  borderRadius: 8,
                  fontSize: 14,
                  color: '#fff',
                  height: 60,
                  textAlignVertical: 'top',
                  boxSizing: 'border-box' as any,
                  ...(Platform.OS === 'web' ? { outlineStyle: 'none', resize: 'vertical' } as any : {})
                }}
              />
            </View>
          </View>
        ))}
      </View>

      {/* ── Application des engrais ── */}
      <View style={[styles.sousSectionHeaderRow, { marginTop: 16 }]}>
        <Text style={styles.sousSectionTitle}>❖ Application des engrais</Text>
      </View>

      
      <RigidTable 
        headers={[
  { label: 'Type d\'engrais', subLabel: '(minéraux, organiques, ...)', width: '16%' },
  { label: 'Nom commercial / formule', width: '20%' },
  { label: 'Quantité / an', width: '13%' },
  { label: 'Période d\'apport', width: '13%' },
  { label: 'Mode d\'apport', subLabel: '(foliaire, au sol)', width: '13%' },
  { label: 'Applicateur', subLabel: '1.Producteur / 2.Applicateur', width: '17%' },
  { label: '', width: '8%' },
]}
        data={engrais}
        renderRow={(e: any, i: number) => (
  <>
    <View style={{ width: '16%', padding: 6, borderRightWidth: 1, borderRightColor: '#2a2a2a', justifyContent: 'center', boxSizing: 'border-box' as any }}>
      <RNTextInput multiline={true} numberOfLines={2} value={e.type} onChangeText={(v: any) => upEngrais(i, 'type', v)} placeholder="Saisir" style={{ width: '100%', backgroundColor: '#1f1f1f', borderWidth: 1, borderColor: '#333', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 8, color: '#fff', fontSize: 12, textAlignVertical: 'top', minHeight: 40, boxSizing: 'border-box' as any, ...(Platform.OS === 'web' ? { outlineStyle: 'none', resize: 'vertical' } as any : {}) }} placeholderTextColor="#666" />
    </View>
    <View style={{ width: '20%', padding: 6, borderRightWidth: 1, borderRightColor: '#2a2a2a', justifyContent: 'center', boxSizing: 'border-box' as any }}>
      <RNTextInput multiline={true} numberOfLines={2} value={e.nom} onChangeText={(v: any) => upEngrais(i, 'nom', v)} placeholder="Saisir" style={{ width: '100%', backgroundColor: '#1f1f1f', borderWidth: 1, borderColor: '#333', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 8, color: '#fff', fontSize: 12, textAlignVertical: 'top', minHeight: 40, boxSizing: 'border-box' as any, ...(Platform.OS === 'web' ? { outlineStyle: 'none', resize: 'vertical' } as any : {}) }} placeholderTextColor="#666" />
    </View>
    <View style={{ width: '13%', padding: 6, borderRightWidth: 1, borderRightColor: '#2a2a2a', justifyContent: 'center', boxSizing: 'border-box' as any }}>
      <RNTextInput multiline={true} numberOfLines={2} value={e.qte} onChangeText={(v: any) => upEngrais(i, 'qte', v)} placeholder="Saisir" style={{ width: '100%', backgroundColor: '#1f1f1f', borderWidth: 1, borderColor: '#333', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 8, color: '#fff', fontSize: 12, textAlignVertical: 'top', minHeight: 40, boxSizing: 'border-box' as any, ...(Platform.OS === 'web' ? { outlineStyle: 'none', resize: 'vertical' } as any : {}) }} placeholderTextColor="#666" />
    </View>
    <View style={{ width: '13%', padding: 6, borderRightWidth: 1, borderRightColor: '#2a2a2a', justifyContent: 'center', boxSizing: 'border-box' as any }}>
      <RNTextInput multiline={true} numberOfLines={2} value={e.periode} onChangeText={(v: any) => upEngrais(i, 'periode', v)} placeholder="Saisir" style={{ width: '100%', backgroundColor: '#1f1f1f', borderWidth: 1, borderColor: '#333', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 8, color: '#fff', fontSize: 12, textAlignVertical: 'top', minHeight: 40, boxSizing: 'border-box' as any, ...(Platform.OS === 'web' ? { outlineStyle: 'none', resize: 'vertical' } as any : {}) }} placeholderTextColor="#666" />
    </View>
    <View style={{ width: '13%', padding: 6, borderRightWidth: 1, borderRightColor: '#2a2a2a', justifyContent: 'center', boxSizing: 'border-box' as any }}>
      <RNTextInput multiline={true} numberOfLines={2} value={e.mode} onChangeText={(v: any) => upEngrais(i, 'mode', v)} placeholder="Saisir" style={{ width: '100%', backgroundColor: '#1f1f1f', borderWidth: 1, borderColor: '#333', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 8, color: '#fff', fontSize: 12, textAlignVertical: 'top', minHeight: 40, boxSizing: 'border-box' as any, ...(Platform.OS === 'web' ? { outlineStyle: 'none', resize: 'vertical' } as any : {}) }} placeholderTextColor="#666" />
    </View>
    <View style={{ width: '17%', padding: 6, borderRightWidth: 1, borderRightColor: '#2a2a2a', justifyContent: 'center', boxSizing: 'border-box' as any }}>
      <CacaoAppSelect value={e.applicateur} onValueChange={(v: any) => upEngrais(i, 'applicateur', v)} options={['1.Producteur', '2.Applicateur']} />
    </View>
    <View style={{ width: '8%', justifyContent: 'center', alignItems: 'center', boxSizing: 'border-box' as any }}>
      <Pressable onPress={() => rmEngrais(i)} style={({ pressed }) => [{ padding: 8 }, pressed && { opacity: 0.5 }]}>
        <Trash2 size={16} color="#ef4444" />
      </Pressable>
    </View>
  </>
)}
      />
    
      <View style={{ marginBottom: 24, alignItems: 'flex-start' }}>
        <Pressable onPress={addEngrais} style={({ pressed }) => [{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(22, 163, 74, 0.1)', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(22, 163, 74, 0.3)' }, pressed && { opacity: 0.7 }]}>
          <Text style={{ color: '#4ade80', fontSize: 13, fontWeight: '600' }}>＋ Ajouter une ligne</Text>
        </Pressable>
      </View>


      {/* ── Application de produits phytosanitaires ── */}
      <View style={[styles.sousSectionHeaderRow, { marginTop: 8 }]}>
        <Text style={styles.sousSectionTitle}>❖ Application de produits phytosanitaires</Text>
      </View>

      
      <RigidTable 
        headers={[
  { label: 'Type de produits', subLabel: '(insecticide, fongicide, herbicide)', width: '16%' },
  { label: 'Nom commercial / formule', width: '20%' },
  { label: 'Quantité / traitement', width: '13%' },
  { label: 'Période de traitement', width: '13%' },
  { label: 'Mode d\'apport', subLabel: '(atomiseur, pulvérisateur)', width: '13%' },
  { label: 'Applicateur', subLabel: '1.Producteur / 2.Applicateur', width: '17%' },
  { label: '', width: '8%' },
]}
        data={phyto}
        renderRow={(e: any, i: number) => (
  <>
    <View style={{ width: '16%', padding: 6, borderRightWidth: 1, borderRightColor: '#2a2a2a', justifyContent: 'center', boxSizing: 'border-box' as any }}>
      <RNTextInput multiline={true} numberOfLines={2} value={e.type} onChangeText={(v: any) => upPhyto(i, 'type', v)} placeholder="Saisir" style={{ width: '100%', backgroundColor: '#1f1f1f', borderWidth: 1, borderColor: '#333', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 8, color: '#fff', fontSize: 12, textAlignVertical: 'top', minHeight: 40, boxSizing: 'border-box' as any, ...(Platform.OS === 'web' ? { outlineStyle: 'none', resize: 'vertical' } as any : {}) }} placeholderTextColor="#666" />
    </View>
    <View style={{ width: '20%', padding: 6, borderRightWidth: 1, borderRightColor: '#2a2a2a', justifyContent: 'center', boxSizing: 'border-box' as any }}>
      <RNTextInput multiline={true} numberOfLines={2} value={e.nom} onChangeText={(v: any) => upPhyto(i, 'nom', v)} placeholder="Saisir" style={{ width: '100%', backgroundColor: '#1f1f1f', borderWidth: 1, borderColor: '#333', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 8, color: '#fff', fontSize: 12, textAlignVertical: 'top', minHeight: 40, boxSizing: 'border-box' as any, ...(Platform.OS === 'web' ? { outlineStyle: 'none', resize: 'vertical' } as any : {}) }} placeholderTextColor="#666" />
    </View>
    <View style={{ width: '13%', padding: 6, borderRightWidth: 1, borderRightColor: '#2a2a2a', justifyContent: 'center', boxSizing: 'border-box' as any }}>
      <RNTextInput multiline={true} numberOfLines={2} value={e.qte} onChangeText={(v: any) => upPhyto(i, 'qte', v)} placeholder="Saisir" style={{ width: '100%', backgroundColor: '#1f1f1f', borderWidth: 1, borderColor: '#333', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 8, color: '#fff', fontSize: 12, textAlignVertical: 'top', minHeight: 40, boxSizing: 'border-box' as any, ...(Platform.OS === 'web' ? { outlineStyle: 'none', resize: 'vertical' } as any : {}) }} placeholderTextColor="#666" />
    </View>
    <View style={{ width: '13%', padding: 6, borderRightWidth: 1, borderRightColor: '#2a2a2a', justifyContent: 'center', boxSizing: 'border-box' as any }}>
      <RNTextInput multiline={true} numberOfLines={2} value={e.periode} onChangeText={(v: any) => upPhyto(i, 'periode', v)} placeholder="Saisir" style={{ width: '100%', backgroundColor: '#1f1f1f', borderWidth: 1, borderColor: '#333', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 8, color: '#fff', fontSize: 12, textAlignVertical: 'top', minHeight: 40, boxSizing: 'border-box' as any, ...(Platform.OS === 'web' ? { outlineStyle: 'none', resize: 'vertical' } as any : {}) }} placeholderTextColor="#666" />
    </View>
    <View style={{ width: '13%', padding: 6, borderRightWidth: 1, borderRightColor: '#2a2a2a', justifyContent: 'center', boxSizing: 'border-box' as any }}>
      <RNTextInput multiline={true} numberOfLines={2} value={e.mode} onChangeText={(v: any) => upPhyto(i, 'mode', v)} placeholder="Saisir" style={{ width: '100%', backgroundColor: '#1f1f1f', borderWidth: 1, borderColor: '#333', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 8, color: '#fff', fontSize: 12, textAlignVertical: 'top', minHeight: 40, boxSizing: 'border-box' as any, ...(Platform.OS === 'web' ? { outlineStyle: 'none', resize: 'vertical' } as any : {}) }} placeholderTextColor="#666" />
    </View>
    <View style={{ width: '17%', padding: 6, borderRightWidth: 1, borderRightColor: '#2a2a2a', justifyContent: 'center', boxSizing: 'border-box' as any }}>
      <CacaoAppSelect value={e.applicateur} onValueChange={(v: any) => upPhyto(i, 'applicateur', v)} options={['1.Producteur', '2.Applicateur']} />
    </View>
    <View style={{ width: '8%', justifyContent: 'center', alignItems: 'center', boxSizing: 'border-box' as any }}>
      <Pressable onPress={() => rmPhyto(i)} style={({ pressed }) => [{ padding: 8 }, pressed && { opacity: 0.5 }]}>
        <Trash2 size={16} color="#ef4444" />
      </Pressable>
    </View>
  </>
)}
      />
    
      <View style={{ marginBottom: 24, alignItems: 'flex-start' }}>
        <Pressable onPress={addPhyto} style={({ pressed }) => [{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(22, 163, 74, 0.1)', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(22, 163, 74, 0.3)' }, pressed && { opacity: 0.7 }]}>
          <Text style={{ color: '#4ade80', fontSize: 13, fontWeight: '600' }}>＋ Ajouter une ligne</Text>
        </Pressable>
      </View>

      {/* ── Gestion des emballages ── */}
      <View style={[styles.sousSectionHeaderRow, { marginTop: 8 }]}>
        <Text style={styles.sousSectionTitle}>❖ Gestion des emballages</Text>
      </View>

      <View style={{ width: '100%', borderWidth: 1, borderColor: 'rgba(68, 64, 60, 0.5)', borderRadius: 8, overflow: 'hidden', marginBottom: 24 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', backgroundColor: '#000', borderBottomWidth: 1, borderBottomColor: 'rgba(68, 64, 60, 0.5)' }}>
          <View style={{ flex: 3.2, padding: 8, borderRightWidth: 1, borderRightColor: 'rgba(68, 64, 60, 0.5)', justifyContent: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 13, fontWeight: 'bold', textAlign: 'center' }}>Champ</Text>
          </View>
          <View style={{ flex: 6.8, padding: 8, justifyContent: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 13, fontWeight: 'bold', textAlign: 'center' }}>Réponse</Text>
          </View>
        </View>

        {/* Body Row */}
        <View style={{ flexDirection: 'row', backgroundColor: 'transparent' }}>
          {/* Colonne 1 : Champ */}
          <View style={{ flex: 3.2, padding: 12, borderRightWidth: 1, borderRightColor: 'rgba(68, 64, 60, 0.5)', justifyContent: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600', lineHeight: 22 }}>
              Que faites-vous des emballages après traitement / application ?
            </Text>
          </View>
          {/* Colonne 2 : Réponse */}
          <View style={{ flex: 6.8, padding: 8, boxSizing: 'border-box' as any }}>
            <View style={{ flex: 1, minHeight: 80, backgroundColor: 'rgba(41, 37, 36, 0.5)', borderWidth: 1, borderColor: 'rgba(68, 64, 60, 0.4)', borderRadius: 8, overflow: 'hidden', boxSizing: 'border-box' as any }}>
              <RNTextInput
                value={emballagesReponse}
                onChangeText={upEmb}
                placeholder="Saisir"
                placeholderTextColor="#57534e"
                multiline={true}
                numberOfLines={3}
                style={{
                  width: '100%',
                  height: '100%',
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                  fontSize: 14,
                  color: '#fff',
                  textAlignVertical: 'top',
                  boxSizing: 'border-box' as any,
                  ...(Platform.OS === 'web' ? { outlineStyle: 'none', resize: 'vertical' } as any : {})
                }}
              />
            </View>
          </View>
        </View>
      </View>
      
        </View>
      </View>
  );
};

  const renderFiche4 = () => {

  
  const prodCacao = data.productionCacaoAncienne && data.productionCacaoAncienne.length > 0 ? data.productionCacaoAncienne : [
    { annee: 'Année N-1 :', prod: '3 500', revenu: '4 200 000' },
    { annee: 'Année N-2 :', prod: '3 200', revenu: '3 840 000' },
    { annee: 'Année N-3 :', prod: '2 900', revenu: '3 480 000' },
  ];
  const upProdCacao = (idx: number, field: string, val: any) => {
    const arr = [...prodCacao];
    arr[idx] = { ...arr[idx], [field]: val };
    updateNested('productionCacaoAncienne', arr);
  };

  const sourcesRevenus = data.sourcesRevenusAutres && data.sourcesRevenusAutres.length > 0 ? data.sourcesRevenusAutres : [
    { activite: 'Activité 1', prod: '', revenu: '' }
  ];
  const upSrc = (idx: number, field: string, val: any) => {
    const arr = [...sourcesRevenus];
    arr[idx] = { ...arr[idx], [field]: val };
    updateNested('sourcesRevenusAutres', arr);
  };
  const addSrc = () => {
    const arr = [...sourcesRevenus, { activite: `Activité ${sourcesRevenus.length + 1}`, prod: '', revenu: '' }];
    updateNested('sourcesRevenusAutres', arr);
  };
  const rmSrc = (idx: number) => {
    const arr = sourcesRevenus.filter((_: any, i: number) => i !== idx);
    updateNested('sourcesRevenusAutres', arr);
  };

  
  const depenses = data.depensesFoyer && data.depensesFoyer.length > 0 ? data.depensesFoyer : [
    { depense: 'Scolarité', periodicite: 'année', montant: '180 000', fixed: true },
    { depense: 'Nourriture', periodicite: 'mois', montant: '45 000', fixed: true },
    { depense: 'Santé', periodicite: 'année', montant: '120 000', fixed: true },
    { depense: 'Electricité', periodicite: '2 mois', montant: '8 000', fixed: true },
    { depense: 'Eau courante', periodicite: 'mois', montant: '3 500', fixed: true },
    { depense: 'Charges sociales (Funérailles, mariage, baptême...)', periodicite: 'année', montant: '200 000', fixed: true },
    { depense: 'Crédit microfinance', periodicite: 'mois', montant: '15 000', fixed: false },
    { depense: 'Transport / carburant', periodicite: 'mois', montant: '12 000', fixed: false },
  ];
  const upDep = (idx: number, field: string, val: any) => {
    const arr = [...depenses];
    arr[idx] = { ...arr[idx], [field]: val };
    updateNested('depensesFoyer', arr);
  };
  const addDep = () => {
    const arr = [...depenses, { depense: '', periodicite: '', montant: '', fixed: false }];
    updateNested('depensesFoyer', arr);
  };
  const rmDep = (idx: number) => {
    const arr = depenses.filter((_: any, i: number) => i !== idx);
    updateNested('depensesFoyer', arr);
  };

  
  const mainOeuvre = data.mainOeuvre && data.mainOeuvre.length > 0 ? data.mainOeuvre : [
    { nom: 'Travailleur 1', statut: '', sexe: 'M', cout: '480 000', temps: '240', fixed: true },
    { nom: 'Travailleur 2', statut: '', sexe: 'M', cout: '180 000', temps: '60', fixed: true },
    { nom: 'Travailleur 3', statut: '', sexe: 'F', cout: '90 000', temps: '30', fixed: true },
    { nom: 'Groupe de travail', statut: '', sexe: 'M', cout: '0', temps: '45', fixed: true },
  ];
  const upMo = (idx: number, field: string, val: any) => {
    const arr = [...mainOeuvre];
    arr[idx] = { ...arr[idx], [field]: val };
    updateNested('mainOeuvre', arr);
  };
  const addMo = () => {
    updateNested('mainOeuvre', [...mainOeuvre, { nom: '', statut: '', sexe: '', cout: '', temps: '', fixed: false }]);
  };
  const rmMo = (idx: number) => {
    updateNested('mainOeuvre', mainOeuvre.filter((_: any, i: number) => i !== idx));
  };

  const epargne = data.epargneFinancement && data.epargneFinancement.length > 0 ? data.epargneFinancement : [
    { nom: 'Mobile Money', compte: '', argent: '', financement: '', montant: '' },
    { nom: 'Microfinance', compte: '', argent: '', financement: '', montant: '350 000 FCFA' },
    { nom: 'Banque', compte: '', argent: '', financement: '', montant: '' },
    { nom: 'Autres, précisez', precision: '', compte: '', argent: '', financement: '', montant: '' },
  ];
  const upEpargne = (idx: number, field: string, val: any) => {
    const arr = [...epargne];
    arr[idx] = { ...arr[idx], [field]: val };
    updateNested('epargneFinancement', arr);
  };

    return (
      <View style={{ padding: 16 }}>
        <Text style={styles.ficheMainTitle}><Text style={{color: "#3b82f6"}}>◆</Text> FICHE 4 : PROFIL SOCIO-ECONOMIQUE DU PRODUCTEUR</Text>
        
      
      <View style={{ width: '100%', backgroundColor: '#1a1a1a', borderRadius: 8, padding: 16, marginBottom: 24, boxSizing: 'border-box' as any }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
          <Text style={{ color: '#22c55e', fontSize: 16, marginRight: 6 }}>◆</Text>
          <Text style={{ color: '#22c55e', fontSize: 14, fontWeight: 'bold' }}>Compte d'épargne et Financement</Text>
        </View>

        <View style={{ width: '100%', borderWidth: 1, borderColor: '#2a2a2a', borderRadius: 0, overflow: 'hidden', boxSizing: 'border-box' as any }}>
          
          {/* Header */}
          <View style={{ flexDirection: 'row', backgroundColor: '#000', borderBottomWidth: 1, borderBottomColor: '#2a2a2a' }}>
            <View style={{ width: '28%', justifyContent: 'center', padding: 8, borderRightWidth: 1, borderRightColor: '#2a2a2a', boxSizing: 'border-box' as any }}>
              <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'left', fontSize: 12 }}>Epargne</Text>
            </View>
            
            <View style={{ width: '72%', flexDirection: 'column', boxSizing: 'border-box' as any }}>
              {/* Level 1 */}
              <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#2a2a2a' }}>
                <View style={{ width: '22.22%', padding: 8, borderRightWidth: 1, borderRightColor: '#2a2a2a', justifyContent: 'center', boxSizing: 'border-box' as any }}>
                  <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center', fontSize: 11 }}>Avez-vous un compte (Oui/Non)</Text>
                </View>
                <View style={{ width: '22.22%', padding: 8, borderRightWidth: 1, borderRightColor: '#2a2a2a', justifyContent: 'center', boxSizing: 'border-box' as any }}>
                  <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center', fontSize: 11 }}>Avez-vous de l'argent sur le compte (oui/Non)</Text>
                </View>
                <View style={{ width: '55.56%', padding: 8, justifyContent: 'center', boxSizing: 'border-box' as any }}>
                  <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center', fontSize: 11 }}>Avez-vous bénéficier de financement (Oui/Non/Montant)</Text>
                </View>
              </View>
              
              {/* Level 2 */}
              <View style={{ flexDirection: 'row' }}>
                <View style={{ width: '11.11%', padding: 6, borderRightWidth: 1, borderRightColor: '#2a2a2a', justifyContent: 'center', boxSizing: 'border-box' as any }}><Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center', fontSize: 11 }}>Oui</Text></View>
                <View style={{ width: '11.11%', padding: 6, borderRightWidth: 1, borderRightColor: '#2a2a2a', justifyContent: 'center', boxSizing: 'border-box' as any }}><Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center', fontSize: 11 }}>Non</Text></View>
                
                <View style={{ width: '11.11%', padding: 6, borderRightWidth: 1, borderRightColor: '#2a2a2a', justifyContent: 'center', boxSizing: 'border-box' as any }}><Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center', fontSize: 11 }}>Oui</Text></View>
                <View style={{ width: '11.11%', padding: 6, borderRightWidth: 1, borderRightColor: '#2a2a2a', justifyContent: 'center', boxSizing: 'border-box' as any }}><Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center', fontSize: 11 }}>Non</Text></View>
                
                <View style={{ width: '11.11%', padding: 6, borderRightWidth: 1, borderRightColor: '#2a2a2a', justifyContent: 'center', boxSizing: 'border-box' as any }}><Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center', fontSize: 11 }}>Oui</Text></View>
                <View style={{ width: '11.11%', padding: 6, borderRightWidth: 1, borderRightColor: '#2a2a2a', justifyContent: 'center', boxSizing: 'border-box' as any }}><Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center', fontSize: 11 }}>Non</Text></View>
                <View style={{ width: '33.34%', padding: 6, justifyContent: 'center', boxSizing: 'border-box' as any }}><Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center', fontSize: 11 }}>Montant</Text></View>
              </View>
            </View>
          </View>

          {/* Rows */}
          {epargne.map((row: any, i: number) => {
            const isSelected = i === 3;
            return (
              <View key={i} style={{ flexDirection: 'row', backgroundColor: isSelected ? '#1e2a4a' : 'transparent', borderTopWidth: 1, borderTopColor: '#2a2a2a', boxSizing: 'border-box' as any }}>
                {/* Col 1 */}
                <View style={{ width: '28%', padding: 12, borderRightWidth: 1, borderRightColor: '#2a2a2a', justifyContent: 'center', boxSizing: 'border-box' as any }}>
                  {isSelected ? (
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
                      <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold', marginRight: 4 }}>Autres, précisez :</Text>
                      <RNTextInput 
                         value={row.precision} 
                         onChangeText={(v: any) => upEpargne(i, 'precision', v)}
                         style={{ flex: 1, borderBottomWidth: 1, borderBottomColor: '#888', borderStyle: 'dotted', color: '#fff', minWidth: 60, fontSize: 12, padding: 0, paddingBottom: 2, ...(Platform.OS === 'web' ? { outlineStyle: 'none' } as any : {}) }}
                         placeholder="..."
                         placeholderTextColor="#666"
                      />
                    </View>
                  ) : (
                    <Text style={{ color: '#e7e5e4', fontSize: 13, fontWeight: 'bold' }}>{row.nom}</Text>
                  )}
                </View>
                
                {/* Right columns */}
                <View style={{ width: '72%', flexDirection: 'row', boxSizing: 'border-box' as any }}>
                  <View style={{ width: '11.11%', borderRightWidth: 1, borderRightColor: '#2a2a2a', justifyContent: 'center', alignItems: 'center', boxSizing: 'border-box' as any }}>
                    <Pressable onPress={() => upEpargne(i, 'compte', row.compte === 'Oui' ? '' : 'Oui')} style={{ width: 16, height: 16, borderWidth: 1, borderColor: '#d1d5db', backgroundColor: row.compte === 'Oui' ? '#d1d5db' : '#000', justifyContent: 'center', alignItems: 'center', borderRadius: 2 }}>
                      {row.compte === 'Oui' && <Check size={12} color="#000" />}
                    </Pressable>
                  </View>
                  <View style={{ width: '11.11%', borderRightWidth: 1, borderRightColor: '#2a2a2a', justifyContent: 'center', alignItems: 'center', boxSizing: 'border-box' as any }}>
                    <Pressable onPress={() => upEpargne(i, 'compte', row.compte === 'Non' ? '' : 'Non')} style={{ width: 16, height: 16, borderWidth: 1, borderColor: '#d1d5db', backgroundColor: row.compte === 'Non' ? '#d1d5db' : '#000', justifyContent: 'center', alignItems: 'center', borderRadius: 2 }}>
                      {row.compte === 'Non' && <Check size={12} color="#000" />}
                    </Pressable>
                  </View>
                  
                  <View style={{ width: '11.11%', borderRightWidth: 1, borderRightColor: '#2a2a2a', justifyContent: 'center', alignItems: 'center', boxSizing: 'border-box' as any }}>
                    <Pressable onPress={() => upEpargne(i, 'argent', row.argent === 'Oui' ? '' : 'Oui')} style={{ width: 16, height: 16, borderWidth: 1, borderColor: '#d1d5db', backgroundColor: row.argent === 'Oui' ? '#d1d5db' : '#000', justifyContent: 'center', alignItems: 'center', borderRadius: 2 }}>
                      {row.argent === 'Oui' && <Check size={12} color="#000" />}
                    </Pressable>
                  </View>
                  <View style={{ width: '11.11%', borderRightWidth: 1, borderRightColor: '#2a2a2a', justifyContent: 'center', alignItems: 'center', boxSizing: 'border-box' as any }}>
                    <Pressable onPress={() => upEpargne(i, 'argent', row.argent === 'Non' ? '' : 'Non')} style={{ width: 16, height: 16, borderWidth: 1, borderColor: '#d1d5db', backgroundColor: row.argent === 'Non' ? '#d1d5db' : '#000', justifyContent: 'center', alignItems: 'center', borderRadius: 2 }}>
                      {row.argent === 'Non' && <Check size={12} color="#000" />}
                    </Pressable>
                  </View>
                  
                  <View style={{ width: '11.11%', borderRightWidth: 1, borderRightColor: '#2a2a2a', justifyContent: 'center', alignItems: 'center', boxSizing: 'border-box' as any }}>
                    <Pressable onPress={() => upEpargne(i, 'financement', row.financement === 'Oui' ? '' : 'Oui')} style={{ width: 16, height: 16, borderWidth: 1, borderColor: '#d1d5db', backgroundColor: row.financement === 'Oui' ? '#d1d5db' : '#000', justifyContent: 'center', alignItems: 'center', borderRadius: 2 }}>
                      {row.financement === 'Oui' && <Check size={12} color="#000" />}
                    </Pressable>
                  </View>
                  <View style={{ width: '11.11%', borderRightWidth: 1, borderRightColor: '#2a2a2a', justifyContent: 'center', alignItems: 'center', boxSizing: 'border-box' as any }}>
                    <Pressable onPress={() => upEpargne(i, 'financement', row.financement === 'Non' ? '' : 'Non')} style={{ width: 16, height: 16, borderWidth: 1, borderColor: '#d1d5db', backgroundColor: row.financement === 'Non' ? '#d1d5db' : '#000', justifyContent: 'center', alignItems: 'center', borderRadius: 2 }}>
                      {row.financement === 'Non' && <Check size={12} color="#000" />}
                    </Pressable>
                  </View>
                  
                  <View style={{ width: '33.34%', padding: 6, justifyContent: 'center', boxSizing: 'border-box' as any }}>
                    <RNTextInput
                      value={row.montant}
                      onChangeText={(v: any) => upEpargne(i, 'montant', v)}
                      placeholder="Saisir"
                      placeholderTextColor="#666"
                      style={{ width: '100%', backgroundColor: '#1a1a1a', borderWidth: 1, borderColor: '#333', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 6, color: '#fff', fontSize: 12, boxSizing: 'border-box' as any, ...(Platform.OS === 'web' ? { outlineStyle: 'none' } as any : {}) }}
                    />
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      
        {/* ── Production de cacao ── */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, marginTop: 32 }}>
          <Text style={{ color: '#22c55e', fontSize: 16, marginRight: 6 }}>◆</Text>
          <Text style={{ color: '#22c55e', fontSize: 14, fontWeight: 'bold' }}>Production de cacao des trois (3) dernières années</Text>
        </View>

        <View style={{ width: '100%', borderWidth: 1, borderColor: '#2a2a2a', borderRadius: 0, overflow: 'hidden', boxSizing: 'border-box' as any, marginBottom: 24 }}>
          {/* Header */}
          <View style={{ flexDirection: 'row', backgroundColor: '#000', borderBottomWidth: 1, borderBottomColor: '#2a2a2a' }}>
            <View style={{ width: '30%', padding: 12, borderRightWidth: 1, borderRightColor: '#2a2a2a', justifyContent: 'center', boxSizing: 'border-box' as any }}>
              <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center', fontSize: 12 }}>ANNEE</Text>
            </View>
            <View style={{ width: '35%', padding: 12, borderRightWidth: 1, borderRightColor: '#2a2a2a', justifyContent: 'center', boxSizing: 'border-box' as any }}>
              <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center', fontSize: 12 }}>Production (kg)</Text>
            </View>
            <View style={{ width: '35%', padding: 12, justifyContent: 'center', boxSizing: 'border-box' as any }}>
              <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center', fontSize: 12 }}>Revenu brut (FCFA)</Text>
            </View>
          </View>

          {/* Rows */}
          {prodCacao.map((row: any, i: number) => (
            <View key={i} style={{ flexDirection: 'row', backgroundColor: 'transparent', borderTopWidth: i === 0 ? 0 : 1, borderTopColor: '#2a2a2a', boxSizing: 'border-box' as any }}>
              <View style={{ width: '30%', padding: 12, borderRightWidth: 1, borderRightColor: '#2a2a2a', justifyContent: 'center', boxSizing: 'border-box' as any }}>
                <Text style={{ color: '#fff', fontSize: 13, fontWeight: 'bold', textAlign: 'center' }}>{row.annee}</Text>
              </View>
              <View style={{ width: '35%', padding: 12, borderRightWidth: 1, borderRightColor: '#2a2a2a', justifyContent: 'center', boxSizing: 'border-box' as any }}>
                <RNTextInput
                  value={String(row.prod || '')}
                  onChangeText={(v: string) => upProdCacao(i, 'prod', v)}
                  keyboardType="numeric"
                  placeholder="Saisir"
                  placeholderTextColor="#666"
                  style={{ width: '100%', backgroundColor: '#1f1f1f', borderWidth: 1, borderColor: '#333', borderRadius: 6, paddingHorizontal: 12, paddingVertical: 10, color: '#fff', fontSize: 13, boxSizing: 'border-box' as any, ...(Platform.OS === 'web' ? { outlineStyle: 'none' } as any : {}) }}
                />
              </View>
              <View style={{ width: '35%', padding: 12, justifyContent: 'center', boxSizing: 'border-box' as any }}>
                <RNTextInput
                  value={String(row.revenu || '')}
                  onChangeText={(v: string) => upProdCacao(i, 'revenu', v)}
                  keyboardType="numeric"
                  placeholder="Saisir"
                  placeholderTextColor="#666"
                  style={{ width: '100%', backgroundColor: '#1f1f1f', borderWidth: 1, borderColor: '#333', borderRadius: 6, paddingHorizontal: 12, paddingVertical: 10, color: '#fff', fontSize: 13, boxSizing: 'border-box' as any, ...(Platform.OS === 'web' ? { outlineStyle: 'none' } as any : {}) }}
                />
              </View>
            </View>
          ))}
        </View>

        {/* ── Sources de revenus ── */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, marginTop: 16 }}>
          <Text style={{ color: '#22c55e', fontSize: 16, marginRight: 6 }}>◆</Text>
          <Text style={{ color: '#22c55e', fontSize: 14, fontWeight: 'bold' }}>Sources de revenus autres que le cacao</Text>
        </View>

        <View style={{ width: '100%', borderWidth: 1, borderColor: '#2a2a2a', borderRadius: 0, overflow: 'hidden', boxSizing: 'border-box' as any, marginBottom: 16 }}>
          {/* Header */}
          <View style={{ flexDirection: 'row', backgroundColor: '#000', borderBottomWidth: 1, borderBottomColor: '#2a2a2a' }}>
            <View style={{ width: '30%', padding: 12, borderRightWidth: 1, borderRightColor: '#2a2a2a', justifyContent: 'center', boxSizing: 'border-box' as any }}>
              <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center', fontSize: 12 }}>ANNEE</Text>
            </View>
            <View style={{ width: '30%', padding: 12, borderRightWidth: 1, borderRightColor: '#2a2a2a', justifyContent: 'center', boxSizing: 'border-box' as any }}>
              <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center', fontSize: 12 }}>Production moyenne annuelle</Text>
            </View>
            <View style={{ width: '30%', padding: 12, borderRightWidth: 1, borderRightColor: '#2a2a2a', justifyContent: 'center', boxSizing: 'border-box' as any }}>
              <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center', fontSize: 12 }}>Revenu brut moyen/an</Text>
            </View>
            <View style={{ width: '10%', padding: 12, justifyContent: 'center', boxSizing: 'border-box' as any }}>
            </View>
          </View>

          {/* Rows */}
          {sourcesRevenus.map((row: any, i: number) => (
            <View key={i} style={{ flexDirection: 'row', backgroundColor: 'transparent', borderTopWidth: i === 0 ? 0 : 1, borderTopColor: '#2a2a2a', boxSizing: 'border-box' as any }}>
              <View style={{ width: '30%', padding: 12, borderRightWidth: 1, borderRightColor: '#2a2a2a', boxSizing: 'border-box' as any }}>
                <RNTextInput
                  value={row.activite}
                  onChangeText={(v: string) => upSrc(i, 'activite', v)}
                  multiline={true}
                  placeholder="Saisir"
                  placeholderTextColor="#666"
                  style={{ width: '100%', minHeight: 60, backgroundColor: '#1f1f1f', borderWidth: 1, borderColor: '#333', borderRadius: 6, paddingHorizontal: 12, paddingVertical: 10, color: '#fff', fontSize: 13, textAlignVertical: 'top', boxSizing: 'border-box' as any, ...(Platform.OS === 'web' ? { outlineStyle: 'none', resize: 'vertical' } as any : {}) }}
                />
              </View>
              <View style={{ width: '30%', padding: 12, borderRightWidth: 1, borderRightColor: '#2a2a2a', boxSizing: 'border-box' as any }}>
                <RNTextInput
                  value={row.prod}
                  onChangeText={(v: string) => upSrc(i, 'prod', v)}
                  multiline={true}
                  placeholder="Saisir"
                  placeholderTextColor="#666"
                  style={{ width: '100%', minHeight: 60, backgroundColor: '#1f1f1f', borderWidth: 1, borderColor: '#333', borderRadius: 6, paddingHorizontal: 12, paddingVertical: 10, color: '#fff', fontSize: 13, textAlignVertical: 'top', boxSizing: 'border-box' as any, ...(Platform.OS === 'web' ? { outlineStyle: 'none', resize: 'vertical' } as any : {}) }}
                />
              </View>
              <View style={{ width: '30%', padding: 12, borderRightWidth: 1, borderRightColor: '#2a2a2a', boxSizing: 'border-box' as any }}>
                <RNTextInput
                  value={row.revenu}
                  onChangeText={(v: string) => upSrc(i, 'revenu', v)}
                  multiline={true}
                  placeholder="Saisir"
                  placeholderTextColor="#666"
                  style={{ width: '100%', minHeight: 60, backgroundColor: '#1f1f1f', borderWidth: 1, borderColor: '#333', borderRadius: 6, paddingHorizontal: 12, paddingVertical: 10, color: '#fff', fontSize: 13, textAlignVertical: 'top', boxSizing: 'border-box' as any, ...(Platform.OS === 'web' ? { outlineStyle: 'none', resize: 'vertical' } as any : {}) }}
                />
              </View>
              <View style={{ width: '10%', padding: 12, justifyContent: 'center', alignItems: 'center', boxSizing: 'border-box' as any }}>
                <Pressable onPress={() => rmSrc(i)} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1, padding: 8, backgroundColor: '#3f1f1f', borderRadius: 8, borderWidth: 1, borderColor: '#6f2f2f' })}>
                  <Trash2 size={18} color="#fca5a5" />
                </Pressable>
              </View>
            </View>
          ))}
        </View>

        <Pressable 
          onPress={addSrc}
          style={({ pressed }) => ({
            flexDirection: 'row', 
            alignItems: 'center', 
            alignSelf: 'flex-start',
            paddingVertical: 10, 
            paddingHorizontal: 16, 
            borderRadius: 20, 
            borderWidth: 1, 
            borderColor: '#22c55e',
            backgroundColor: pressed ? 'rgba(34, 197, 94, 0.1)' : 'transparent'
          })}
        >
          <Plus size={16} color="#22c55e" style={{ marginRight: 6 }} />
          <Text style={{ color: '#22c55e', fontSize: 14, fontWeight: 'bold' }}>Ajouter une activité</Text>
        </Pressable>

      
        {/* ── Dépenses courantes du foyer ── */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, marginTop: 32 }}>
          <Text style={{ color: '#22c55e', fontSize: 16, marginRight: 6 }}>◆</Text>
          <Text style={{ color: '#22c55e', fontSize: 14, fontWeight: 'bold' }}>Dépenses courantes du foyer</Text>
        </View>

        <View style={{ width: '100%', borderWidth: 1, borderColor: '#2a2a2a', borderRadius: 0, overflow: 'hidden', boxSizing: 'border-box' as any, marginBottom: 16 }}>
          {/* Header */}
          <View style={{ flexDirection: 'row', backgroundColor: '#000', borderBottomWidth: 1, borderBottomColor: '#2a2a2a' }}>
            <View style={{ width: '40%', padding: 12, borderRightWidth: 1, borderRightColor: '#2a2a2a', justifyContent: 'center', boxSizing: 'border-box' as any }}>
              <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center', fontSize: 12 }}>Dépenses</Text>
            </View>
            <View style={{ width: '20%', padding: 12, borderRightWidth: 1, borderRightColor: '#2a2a2a', justifyContent: 'center', boxSizing: 'border-box' as any }}>
              <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center', fontSize: 12 }}>Périodicité</Text>
            </View>
            <View style={{ width: '30%', padding: 12, borderRightWidth: 1, borderRightColor: '#2a2a2a', justifyContent: 'center', boxSizing: 'border-box' as any }}>
              <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center', fontSize: 12 }}>Montant moyen/an</Text>
            </View>
            <View style={{ width: '10%', padding: 12, justifyContent: 'center', boxSizing: 'border-box' as any }}>
            </View>
          </View>

          {/* Rows */}
          {depenses.map((row: any, i: number) => (
            <View key={i} style={{ flexDirection: 'row', backgroundColor: 'transparent', borderTopWidth: i === 0 ? 0 : 1, borderTopColor: '#2a2a2a', boxSizing: 'border-box' as any }}>
              <View style={{ width: '40%', padding: 12, borderRightWidth: 1, borderRightColor: '#2a2a2a', justifyContent: 'center', boxSizing: 'border-box' as any }}>
                {row.fixed ? (
                  <Text style={{ color: '#fff', fontSize: 13, fontWeight: 'bold' }}>{row.depense}</Text>
                ) : (
                  <RNTextInput
                    value={row.depense}
                    onChangeText={(v: string) => upDep(i, 'depense', v)}
                    placeholder="Saisir"
                    placeholderTextColor="#666"
                    style={{ width: '100%', backgroundColor: '#1f1f1f', borderWidth: 1, borderColor: '#333', borderRadius: 6, paddingHorizontal: 12, paddingVertical: 10, color: '#fff', fontSize: 13, boxSizing: 'border-box' as any, ...(Platform.OS === 'web' ? { outlineStyle: 'none' } as any : {}) }}
                  />
                )}
              </View>
              <View style={{ width: '20%', padding: 12, borderRightWidth: 1, borderRightColor: '#2a2a2a', justifyContent: 'center', boxSizing: 'border-box' as any }}>
                {row.fixed ? (
                  <Text style={{ color: '#e7e5e4', fontSize: 13, textAlign: 'center' }}>{row.periodicite}</Text>
                ) : (
                  <RNTextInput
                    value={row.periodicite}
                    onChangeText={(v: string) => upDep(i, 'periodicite', v)}
                    placeholder="Saisir"
                    placeholderTextColor="#666"
                    style={{ width: '100%', backgroundColor: '#1f1f1f', borderWidth: 1, borderColor: '#333', borderRadius: 6, paddingHorizontal: 12, paddingVertical: 10, color: '#fff', fontSize: 13, boxSizing: 'border-box' as any, ...(Platform.OS === 'web' ? { outlineStyle: 'none' } as any : {}) }}
                  />
                )}
              </View>
              <View style={{ width: '30%', padding: 12, borderRightWidth: 1, borderRightColor: '#2a2a2a', justifyContent: 'center', boxSizing: 'border-box' as any }}>
                <RNTextInput
                  value={row.montant}
                  onChangeText={(v: string) => upDep(i, 'montant', v)}
                  keyboardType="numeric"
                  placeholder="Saisir"
                  placeholderTextColor="#666"
                  style={{ width: '100%', backgroundColor: '#1f1f1f', borderWidth: 1, borderColor: '#333', borderRadius: 6, paddingHorizontal: 12, paddingVertical: 10, color: '#fff', fontSize: 13, boxSizing: 'border-box' as any, ...(Platform.OS === 'web' ? { outlineStyle: 'none' } as any : {}) }}
                />
              </View>
              <View style={{ width: '10%', padding: 12, justifyContent: 'center', alignItems: 'center', boxSizing: 'border-box' as any }}>
                {!row.fixed && (
                  <Pressable onPress={() => rmDep(i)} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1, padding: 8, backgroundColor: '#3f1f1f', borderRadius: 8, borderWidth: 1, borderColor: '#6f2f2f' })}>
                    <Trash2 size={18} color="#fca5a5" />
                  </Pressable>
                )}
              </View>
            </View>
          ))}
        </View>

        <Pressable 
          onPress={addDep}
          style={({ pressed }) => ({
            flexDirection: 'row', 
            alignItems: 'center', 
            alignSelf: 'flex-start',
            paddingVertical: 10, 
            paddingHorizontal: 16, 
            borderRadius: 20, 
            borderWidth: 1, 
            borderColor: '#22c55e',
            backgroundColor: pressed ? 'rgba(34, 197, 94, 0.1)' : 'transparent'
          })}
        >
          <Plus size={16} color="#22c55e" style={{ marginRight: 6 }} />
          <Text style={{ color: '#22c55e', fontSize: 14, fontWeight: 'bold' }}>Ajouter une dépense</Text>
        </Pressable>

      
        {/* ── Coût de la main d'œuvre ── */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, marginTop: 32 }}>
          <Text style={{ color: '#22c55e', fontSize: 16, marginRight: 6 }}>◆</Text>
          <Text style={{ color: '#22c55e', fontSize: 14, fontWeight: 'bold' }}>Coût de la main d'œuvre</Text>
        </View>

        <View style={{ width: '100%', borderWidth: 1, borderColor: '#2a2a2a', borderRadius: 0, overflow: 'hidden', boxSizing: 'border-box' as any, marginBottom: 16 }}>
          
          {/* Header */}
          <View style={{ flexDirection: 'row', backgroundColor: '#000', borderBottomWidth: 1, borderBottomColor: '#2a2a2a' }}>
            <View style={{ width: '20%', justifyContent: 'center', padding: 8, borderRightWidth: 1, borderRightColor: '#2a2a2a', boxSizing: 'border-box' as any }}>
              <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'left', fontSize: 12 }}>Travailleur</Text>
            </View>
            
            <View style={{ width: '30%', flexDirection: 'column', boxSizing: 'border-box' as any, borderRightWidth: 1, borderRightColor: '#2a2a2a' }}>
              <View style={{ borderBottomWidth: 1, borderBottomColor: '#2a2a2a', padding: 8, justifyContent: 'center', boxSizing: 'border-box' as any }}>
                <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center', fontSize: 11 }}>Statut de la main d'œuvre</Text>
              </View>
              <View style={{ flexDirection: 'row', flex: 1 }}>
                <View style={{ width: '33.33%', padding: 6, borderRightWidth: 1, borderRightColor: '#2a2a2a', justifyContent: 'center', boxSizing: 'border-box' as any }}><Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center', fontSize: 10 }}>Mo permanente</Text></View>
                <View style={{ width: '33.33%', padding: 6, borderRightWidth: 1, borderRightColor: '#2a2a2a', justifyContent: 'center', boxSizing: 'border-box' as any }}><Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center', fontSize: 10 }}>Mo occasionnel</Text></View>
                <View style={{ width: '33.34%', padding: 6, justifyContent: 'center', boxSizing: 'border-box' as any }}><Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center', fontSize: 10 }}>Non rémunérée (familiale)</Text></View>
              </View>
            </View>

            <View style={{ width: '10%', justifyContent: 'center', padding: 8, borderRightWidth: 1, borderRightColor: '#2a2a2a', boxSizing: 'border-box' as any }}>
              <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center', fontSize: 11 }}>Sexe</Text>
            </View>
            
            <View style={{ width: '15%', justifyContent: 'center', padding: 8, borderRightWidth: 1, borderRightColor: '#2a2a2a', boxSizing: 'border-box' as any }}>
              <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center', fontSize: 11 }}>Coût annuel</Text>
            </View>

            <View style={{ width: '15%', justifyContent: 'center', padding: 8, borderRightWidth: 1, borderRightColor: '#2a2a2a', boxSizing: 'border-box' as any }}>
              <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center', fontSize: 11 }}>Temps de travail (jour)</Text>
            </View>

            <View style={{ width: '10%', justifyContent: 'center', padding: 8, boxSizing: 'border-box' as any }}>
            </View>
          </View>

          {/* Rows */}
          {mainOeuvre.map((row: any, i: number) => (
            <View key={i} style={{ flexDirection: 'row', backgroundColor: 'transparent', borderTopWidth: i === 0 ? 0 : 1, borderTopColor: '#2a2a2a', boxSizing: 'border-box' as any }}>
              
              <View style={{ width: '20%', padding: 12, borderRightWidth: 1, borderRightColor: '#2a2a2a', justifyContent: 'center', boxSizing: 'border-box' as any }}>
                {row.fixed ? (
                  <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>{row.nom}</Text>
                ) : (
                  <RNTextInput
                    value={row.nom}
                    onChangeText={(v: string) => upMo(i, 'nom', v)}
                    placeholder="Nom"
                    placeholderTextColor="#666"
                    style={{ width: '100%', backgroundColor: '#1f1f1f', borderWidth: 1, borderColor: '#333', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 8, color: '#fff', fontSize: 12, boxSizing: 'border-box' as any, ...(Platform.OS === 'web' ? { outlineStyle: 'none' } as any : {}) }}
                  />
                )}
              </View>
              
              <View style={{ width: '10%', borderRightWidth: 1, borderRightColor: '#2a2a2a', justifyContent: 'center', alignItems: 'center', boxSizing: 'border-box' as any }}>
                <Pressable onPress={() => upMo(i, 'statut', row.statut === 'permanente' ? '' : 'permanente')} style={{ width: 16, height: 16, borderWidth: 1, borderColor: row.statut === 'permanente' ? '#22c55e' : '#d1d5db', backgroundColor: row.statut === 'permanente' ? '#22c55e' : '#000', justifyContent: 'center', alignItems: 'center', borderRadius: 2 }}>
                  {row.statut === 'permanente' && <Check size={12} color="#fff" />}
                </Pressable>
              </View>
              <View style={{ width: '10%', borderRightWidth: 1, borderRightColor: '#2a2a2a', justifyContent: 'center', alignItems: 'center', boxSizing: 'border-box' as any }}>
                <Pressable onPress={() => upMo(i, 'statut', row.statut === 'occasionnel' ? '' : 'occasionnel')} style={{ width: 16, height: 16, borderWidth: 1, borderColor: row.statut === 'occasionnel' ? '#22c55e' : '#d1d5db', backgroundColor: row.statut === 'occasionnel' ? '#22c55e' : '#000', justifyContent: 'center', alignItems: 'center', borderRadius: 2 }}>
                  {row.statut === 'occasionnel' && <Check size={12} color="#fff" />}
                </Pressable>
              </View>
              <View style={{ width: '10%', borderRightWidth: 1, borderRightColor: '#2a2a2a', justifyContent: 'center', alignItems: 'center', boxSizing: 'border-box' as any }}>
                <Pressable onPress={() => upMo(i, 'statut', row.statut === 'familiale' ? '' : 'familiale')} style={{ width: 16, height: 16, borderWidth: 1, borderColor: row.statut === 'familiale' ? '#22c55e' : '#d1d5db', backgroundColor: row.statut === 'familiale' ? '#22c55e' : '#000', justifyContent: 'center', alignItems: 'center', borderRadius: 2 }}>
                  {row.statut === 'familiale' && <Check size={12} color="#fff" />}
                </Pressable>
              </View>

              <View style={{ width: '10%', padding: 8, borderRightWidth: 1, borderRightColor: '#2a2a2a', justifyContent: 'center', boxSizing: 'border-box' as any }}>
                <RNTextInput
                  value={row.sexe}
                  onChangeText={(v: string) => upMo(i, 'sexe', v)}
                  placeholder="M/F"
                  placeholderTextColor="#666"
                  style={{ width: '100%', backgroundColor: '#1f1f1f', borderWidth: 1, borderColor: '#333', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 8, color: '#fff', fontSize: 12, textAlign: 'center', boxSizing: 'border-box' as any, ...(Platform.OS === 'web' ? { outlineStyle: 'none' } as any : {}) }}
                />
              </View>

              <View style={{ width: '15%', padding: 8, borderRightWidth: 1, borderRightColor: '#2a2a2a', justifyContent: 'center', boxSizing: 'border-box' as any }}>
                <RNTextInput
                  value={row.cout}
                  onChangeText={(v: string) => upMo(i, 'cout', v)}
                  keyboardType="numeric"
                  placeholder="Saisir"
                  placeholderTextColor="#666"
                  style={{ width: '100%', backgroundColor: '#1f1f1f', borderWidth: 1, borderColor: '#333', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 8, color: '#fff', fontSize: 12, boxSizing: 'border-box' as any, ...(Platform.OS === 'web' ? { outlineStyle: 'none' } as any : {}) }}
                />
              </View>

              <View style={{ width: '15%', padding: 8, borderRightWidth: 1, borderRightColor: '#2a2a2a', justifyContent: 'center', boxSizing: 'border-box' as any }}>
                <RNTextInput
                  value={row.temps}
                  onChangeText={(v: string) => upMo(i, 'temps', v)}
                  keyboardType="numeric"
                  placeholder="Saisir"
                  placeholderTextColor="#666"
                  style={{ width: '100%', backgroundColor: '#1f1f1f', borderWidth: 1, borderColor: '#333', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 8, color: '#fff', fontSize: 12, boxSizing: 'border-box' as any, ...(Platform.OS === 'web' ? { outlineStyle: 'none' } as any : {}) }}
                />
              </View>

              <View style={{ width: '10%', padding: 8, justifyContent: 'center', alignItems: 'center', boxSizing: 'border-box' as any }}>
                {!row.fixed && (
                  <Pressable onPress={() => rmMo(i)} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1, padding: 8, backgroundColor: '#3f1f1f', borderRadius: 8, borderWidth: 1, borderColor: '#6f2f2f' })}>
                    <Trash2 size={18} color="#fca5a5" />
                  </Pressable>
                )}
              </View>
            </View>
          ))}
        </View>

        <Pressable 
          onPress={addMo}
          style={({ pressed }) => ({
            flexDirection: 'row', 
            alignItems: 'center', 
            alignSelf: 'flex-start',
            paddingVertical: 10, 
            paddingHorizontal: 16, 
            borderRadius: 20, 
            borderWidth: 1, 
            borderColor: '#22c55e',
            backgroundColor: pressed ? 'rgba(34, 197, 94, 0.1)' : 'transparent'
          })}
        >
          <Plus size={16} color="#22c55e" style={{ marginRight: 6 }} />
          <Text style={{ color: '#22c55e', fontSize: 14, fontWeight: 'bold' }}>Ajouter un travailleur</Text>
        </Pressable>

      </View></View>
    );
  };

  const renderFiche5 = () => {
    const THEMES_FICHE5 = [
      { theme: 'Peuplement du verger', hint: 'densité, matériel végétal, nombre de tiges/pieds, plages vides …' },
      { theme: 'Entretien du verger' },
      { theme: 'Etat sanitaire du verger' },
      { theme: 'Arbres d\'ombrage' },
      { theme: 'Etat du sol' },
      { theme: 'Cours/sources d\'eau' },
      { theme: 'Terre/Jachères disponibles' },
      { theme: 'Matériel et équipement' },
      { theme: 'Gestion de l\'exploitation' },
      { theme: 'Autres cultures/activités' }
    ];

    const analyse = data.analyseProblemes && data.analyseProblemes.length === 10 
      ? data.analyseProblemes 
      : THEMES_FICHE5.map(t => ({ theme: t.theme, hint: t.hint, problemes: '', causes: '', consequences: '', solutions: '' }));

    const upAnalyse = (idx: number, field: string, val: string) => {
      const arr = [...analyse];
      arr[idx] = { ...arr[idx], [field]: val };
      updateNested('analyseProblemes', arr);
    };

    return (
      <View style={{ padding: 16, paddingBottom: 64 }}>
        <Text style={styles.ficheAnnexeTitle}>
          <Text style={{color: '#ef4444'}}>◆</Text> Annexe 2 : Outils d'analyse des données
        </Text>
        <Text style={styles.ficheMainTitle}>
          <Text style={{color: '#3b82f6'}}>◆</Text> FICHE 5 : ANALYSE DES PROBLEMES
        </Text>

        <View style={{ width: '100%', backgroundColor: '#0a0a0a', borderWidth: 1, borderColor: '#2a2a2a', borderRadius: 0, overflow: 'hidden', boxSizing: 'border-box' as any }}>
          {/* Header */}
          <View style={{ flexDirection: 'row', backgroundColor: '#000', borderBottomWidth: 1, borderBottomColor: '#2a2a2a' }}>
            <View style={{ width: '22%', padding: 12, borderRightWidth: 1, borderRightColor: '#2a2a2a', justifyContent: 'center', boxSizing: 'border-box' as any }}>
              <Text style={{ color: '#fff', fontSize: 13, fontWeight: 'bold', textAlign: 'center', textTransform: 'uppercase' }}>THÈMES D'ANALYSE</Text>
            </View>
            <View style={{ width: '19.5%', padding: 12, borderRightWidth: 1, borderRightColor: '#2a2a2a', justifyContent: 'center', boxSizing: 'border-box' as any }}>
              <Text style={{ color: '#fff', fontSize: 13, fontWeight: 'bold', textAlign: 'center', textTransform: 'uppercase' }}>PROBLÈMES OU CONTRAINTES</Text>
            </View>
            <View style={{ width: '19.5%', padding: 12, borderRightWidth: 1, borderRightColor: '#2a2a2a', justifyContent: 'center', boxSizing: 'border-box' as any }}>
              <Text style={{ color: '#fff', fontSize: 13, fontWeight: 'bold', textAlign: 'center', textTransform: 'uppercase' }}>CAUSES</Text>
            </View>
            <View style={{ width: '19.5%', padding: 12, borderRightWidth: 1, borderRightColor: '#2a2a2a', justifyContent: 'center', boxSizing: 'border-box' as any }}>
              <Text style={{ color: '#fff', fontSize: 13, fontWeight: 'bold', textAlign: 'center', textTransform: 'uppercase' }}>CONSÉQUENCES</Text>
            </View>
            <View style={{ width: '19.5%', padding: 12, justifyContent: 'center', boxSizing: 'border-box' as any }}>
              <Text style={{ color: '#fff', fontSize: 13, fontWeight: 'bold', textAlign: 'center', textTransform: 'uppercase' }}>SOLUTIONS</Text>
            </View>
          </View>

          {/* Body Rows */}
          {analyse.map((row: any, i: number) => (
            <View key={i} style={{ flexDirection: 'row', borderBottomWidth: i < 9 ? 1 : 0, borderBottomColor: '#2a2a2a', backgroundColor: 'transparent', boxSizing: 'border-box' as any }}>
              {/* Thème */}
              <View style={{ width: '22%', padding: 12, borderRightWidth: 1, borderRightColor: '#2a2a2a', justifyContent: 'flex-start', boxSizing: 'border-box' as any }}>
                <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>{row.theme}</Text>
                {row.hint ? (
                  <Text style={{ color: '#a8a29e', fontSize: 12, fontStyle: 'italic', marginTop: 4 }}>({row.hint})</Text>
                ) : null}
              </View>

              {/* Problèmes */}
              <View style={{ width: '19.5%', padding: 6, borderRightWidth: 1, borderRightColor: '#2a2a2a', boxSizing: 'border-box' as any }}>
                <RNTextInput
                  value={row.problemes}
                  onChangeText={(v: any) => upAnalyse(i, 'problemes', v)}
                  multiline={true}
                  style={{
                    width: '100%',
                    minHeight: 80,
                    backgroundColor: '#1a1a1a',
                    borderWidth: 1,
                    borderColor: row.problemes ? '#22c55e' : '#333',
                    borderRadius: 6,
                    paddingHorizontal: 8,
                    paddingVertical: 8,
                    color: '#fff',
                    fontSize: 13,
                    textAlignVertical: 'top',
                    boxSizing: 'border-box' as any,
                    ...(Platform.OS === 'web' ? { outlineStyle: 'none', resize: 'vertical' } as any : {})
                  }}
                />
              </View>

              {/* Causes */}
              <View style={{ width: '19.5%', padding: 6, borderRightWidth: 1, borderRightColor: '#2a2a2a', boxSizing: 'border-box' as any }}>
                <RNTextInput
                  value={row.causes}
                  onChangeText={(v: any) => upAnalyse(i, 'causes', v)}
                  multiline={true}
                  style={{
                    width: '100%',
                    minHeight: 80,
                    backgroundColor: '#1a1a1a',
                    borderWidth: 1,
                    borderColor: row.causes ? '#22c55e' : '#333',
                    borderRadius: 6,
                    paddingHorizontal: 8,
                    paddingVertical: 8,
                    color: '#fff',
                    fontSize: 13,
                    textAlignVertical: 'top',
                    boxSizing: 'border-box' as any,
                    ...(Platform.OS === 'web' ? { outlineStyle: 'none', resize: 'vertical' } as any : {})
                  }}
                />
              </View>

              {/* Conséquences */}
              <View style={{ width: '19.5%', padding: 6, borderRightWidth: 1, borderRightColor: '#2a2a2a', boxSizing: 'border-box' as any }}>
                <RNTextInput
                  value={row.consequences}
                  onChangeText={(v: any) => upAnalyse(i, 'consequences', v)}
                  multiline={true}
                  style={{
                    width: '100%',
                    minHeight: 80,
                    backgroundColor: '#1a1a1a',
                    borderWidth: 1,
                    borderColor: row.consequences ? '#22c55e' : '#333',
                    borderRadius: 6,
                    paddingHorizontal: 8,
                    paddingVertical: 8,
                    color: '#fff',
                    fontSize: 13,
                    textAlignVertical: 'top',
                    boxSizing: 'border-box' as any,
                    ...(Platform.OS === 'web' ? { outlineStyle: 'none', resize: 'vertical' } as any : {})
                  }}
                />
              </View>

              {/* Solutions */}
              <View style={{ width: '19.5%', padding: 6, boxSizing: 'border-box' as any }}>
                <RNTextInput
                  value={row.solutions}
                  onChangeText={(v: any) => upAnalyse(i, 'solutions', v)}
                  multiline={true}
                  style={{
                    width: '100%',
                    minHeight: 80,
                    backgroundColor: '#1a1a1a',
                    borderWidth: 1,
                    borderColor: row.solutions ? '#22c55e' : '#333',
                    borderRadius: 6,
                    paddingHorizontal: 8,
                    paddingVertical: 8,
                    color: '#fff',
                    fontSize: 13,
                    textAlignVertical: 'top',
                    boxSizing: 'border-box' as any,
                    ...(Platform.OS === 'web' ? { outlineStyle: 'none', resize: 'vertical' } as any : {})
                  }}
                />
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  };

  
  
  const renderMatriceAxes = (config: {
    titreFiche: string;
    dataKey: 'planification' | 'programmeAnnuel';
    periodesKey: 'periodes' | 'chronogramme';
    periodesTitre: string;
    periodesLabels: string[];
    periodesLargeur: string;
    colonnesPre: { titre: string; largeur: string; champ: string; type: 'texte' | 'montant' | 'multiline' }[];
    colonnesPost: { titre: string; largeur: string; champ: string; type: 'texte' | 'montant' | 'multiline' }[];
    poubelleLargeur: string;
  }) => {
    // Initialisation conditionnelle
    const matriceData = data[config.dataKey] && data[config.dataKey]!.length > 0
      ? data[config.dataKey]
      : [{
          nom: "Nouvel axe",
          activites: [{
            ...config.colonnesPre.reduce((acc, col) => ({ ...acc, [col.champ]: "" }), {}),
            ...config.colonnesPost.reduce((acc, col) => ({ ...acc, [col.champ]: "" }), {}),
            [config.periodesKey]: config.periodesLabels.reduce((acc, p) => ({ ...acc, [p]: null }), {})
          }]
        }];

    const upAxe = (aIdx: number, val: string) => {
      const arr = [...matriceData!];
      arr[aIdx].nom = val;
      updateNested(config.dataKey, arr);
    };

    const upAct = (aIdx: number, acIdx: number, field: string, val: string) => {
      const arr = [...matriceData!];
      arr[aIdx].activites[acIdx][field] = val;
      updateNested(config.dataKey, arr);
    };

    const openColorPicker = (aIdx: number, acIdx: number, p: string) => {
      const key = `${config.dataKey}-${aIdx}-${acIdx}-${p}`;
      setPickerKey(prev => prev === key ? null : key);
    };

    const setCouleur = (aIdx: number, acIdx: number, p: string, couleur: string | null) => {
      const arr = [...matriceData!];
      arr[aIdx].activites[acIdx][config.periodesKey][p] = couleur;
      updateNested(config.dataKey, arr);
      setPickerKey(null);
    };

    const addAxe = () => {
      const arr = [...matriceData!];
      arr.push({
        nom: "Nouvel axe",
        activites: [{
          ...config.colonnesPre.reduce((acc, col) => ({ ...acc, [col.champ]: "" }), {}),
          ...config.colonnesPost.reduce((acc, col) => ({ ...acc, [col.champ]: "" }), {}),
          [config.periodesKey]: config.periodesLabels.reduce((acc, p) => ({ ...acc, [p]: null }), {})
        }]
      });
      updateNested(config.dataKey, arr);
    };

    const addActivite = (aIdx: number) => {
      const arr = [...matriceData!];
      if (!arr[aIdx].activites) arr[aIdx].activites = [];
      arr[aIdx].activites.push({
        ...config.colonnesPre.reduce((acc, col) => ({ ...acc, [col.champ]: "" }), {}),
        ...config.colonnesPost.reduce((acc, col) => ({ ...acc, [col.champ]: "" }), {}),
        [config.periodesKey]: config.periodesLabels.reduce((acc, p) => ({ ...acc, [p]: null }), {})
      });
      updateNested(config.dataKey, arr);
    };

    const rmActivite = (aIdx: number, acIdx: number) => {
      const arr = [...matriceData!];
      arr[aIdx].activites.splice(acIdx, 1);
      updateNested(config.dataKey, arr);
    };

    const rmAxe = (aIdx: number) => {
      const arr = [...matriceData!];
      arr.splice(aIdx, 1);
      updateNested(config.dataKey, arr);
    };

    const renderInput = (act: any, col: any, aIdx: number, acIdx: number) => {
      if (col.type === 'montant') {
        return (
          <RNTextInput
            value={act[col.champ]}
            onChangeText={(v: any) => upAct(aIdx, acIdx, col.champ, v)}
            keyboardType="numeric"
            style={{ width: '100%', minHeight: 60, backgroundColor: '#1a1a1a', borderWidth: 1, borderColor: '#333', borderRadius: 6, paddingHorizontal: 4, paddingVertical: 8, color: '#fff', fontSize: 11, boxSizing: 'border-box' as any, ...(Platform.OS === 'web' ? { outlineStyle: 'none' } as any : {}) }}
          />
        );
      }
      return (
        <RNTextInput
          value={act[col.champ]}
          onChangeText={(v: any) => upAct(aIdx, acIdx, col.champ, v)}
          multiline={true}
          style={{ width: '100%', minHeight: 60, backgroundColor: '#1a1a1a', borderWidth: 1, borderColor: '#333', borderRadius: 6, padding: col.type === 'texte' ? 6 : 8, color: '#fff', fontSize: col.type === 'texte' ? 11 : 12, textAlign: col.type === 'texte' ? 'center' : 'left', textAlignVertical: col.type === 'texte' ? 'center' : 'top', boxSizing: 'border-box' as any, ...(Platform.OS === 'web' ? { outlineStyle: 'none', resize: 'vertical' } as any : {}) }}
        />
      );
    };

    return (
      <Pressable onPress={() => setPickerKey(null)} style={{ padding: 16, paddingBottom: 64 }}>
        <Text style={styles.ficheMainTitle}>
            <Text style={{color: '#3b82f6'}}>◆</Text> {config.titreFiche}
          </Text>

        <View style={{ width: '100%', backgroundColor: '#0a0a0a', borderWidth: 1, borderColor: '#2a2a2a', borderRadius: 0, overflow: 'visible', boxSizing: 'border-box' as any }}>
          {/* Header */}
          <View style={{ flexDirection: 'row', backgroundColor: '#000', borderBottomWidth: 1, borderBottomColor: '#2a2a2a' }}>
            <View style={{ width: '20%', padding: 12, borderRightWidth: 1, borderRightColor: '#2a2a2a', justifyContent: 'center', boxSizing: 'border-box' as any }}>
              <Text style={{ color: '#fff', fontSize: 13, fontWeight: 'bold', textAlign: 'center', textTransform: 'uppercase' }}>Axes stratégiques</Text>
            </View>
            <View style={{ width: '80%', flexDirection: 'row', boxSizing: 'border-box' as any }}>
              {config.colonnesPre.map((col, i) => (
                <View key={i} style={{ width: col.largeur as any, padding: 12, borderRightWidth: 1, borderRightColor: '#2a2a2a', justifyContent: 'center', boxSizing: 'border-box' as any }}>
                  <Text style={{ color: '#fff', fontSize: 13, fontWeight: 'bold', textAlign: 'center', textTransform: 'uppercase' }}>{col.titre}</Text>
                </View>
              ))}
              
              <View style={{ width: config.periodesLargeur as any, flexDirection: 'column', borderRightWidth: 1, borderRightColor: '#2a2a2a', boxSizing: 'border-box' as any }}>
                <View style={{ borderBottomWidth: 1, borderBottomColor: '#2a2a2a', padding: 8, justifyContent: 'center', alignItems: 'center', boxSizing: 'border-box' as any }}>
                  <Text style={{ color: '#fff', fontSize: 13, fontWeight: 'bold', textAlign: 'center', textTransform: 'uppercase' }}>{config.periodesTitre}</Text>
                </View>
                <View style={{ flexDirection: 'row', flex: 1 }}>
                  {config.periodesLabels.map((p, i) => (
                    <View key={i} style={{ flex: 1, borderRightWidth: i < config.periodesLabels.length - 1 ? 1 : 0, borderRightColor: '#2a2a2a', justifyContent: 'center', alignItems: 'center', padding: 4, boxSizing: 'border-box' as any }}>
                      <Text style={{ color: '#fff', fontSize: 11, fontWeight: 'bold' }}>{p}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {config.colonnesPost.map((col, i) => (
                <View key={i} style={{ width: col.largeur as any, padding: 12, borderRightWidth: 1, borderRightColor: '#2a2a2a', justifyContent: 'center', boxSizing: 'border-box' as any }}>
                  <Text style={{ color: '#fff', fontSize: 13, fontWeight: 'bold', textAlign: 'center', textTransform: 'uppercase' }}>{col.titre}</Text>
                </View>
              ))}

              <View style={{ width: config.poubelleLargeur as any, justifyContent: 'center', alignItems: 'center', boxSizing: 'border-box' as any }}>
                <Trash2 size={16} color="#666" />
              </View>
            </View>
          </View>

          {/* Axes et Activités */}
          {matriceData!.map((axe: any, aIdx: number) => (
            <View key={aIdx} style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#2a2a2a', boxSizing: 'border-box' as any }}>
              {/* Colonne Axe */}
              <View style={{ width: '20%', padding: 12, borderRightWidth: 1, borderRightColor: '#2a2a2a', justifyContent: 'flex-start', alignItems: 'flex-start', boxSizing: 'border-box' as any }}>
                <RNTextInput
                  value={axe.nom}
                  onChangeText={(v: any) => upAxe(aIdx, v)}
                  multiline={true}
                  placeholder="Nom de l'axe"
                  placeholderTextColor="#666"
                  style={{ width: '100%', color: '#fff', fontSize: 14, fontWeight: 'bold', textDecorationLine: 'underline', marginBottom: 12, ...(Platform.OS === 'web' ? { outlineStyle: 'none' } as any : {}) }}
                />
                <Pressable onPress={() => addActivite(aIdx)} style={({ pressed }) => [{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }, pressed && { opacity: 0.7 }]}>
                  <Text style={{ color: '#22c55e', fontSize: 13, fontWeight: 'bold' }}>+ Ajouter une activité</Text>
                </Pressable>
                
                <Pressable onPress={() => rmAxe(aIdx)} style={({ pressed }) => [{ flexDirection: 'row', alignItems: 'center', marginTop: 'auto' }, pressed && { opacity: 0.7 }]}>
                  <Text style={{ color: '#ef4444', fontSize: 12 }}>Supprimer l'axe</Text>
                </Pressable>
              </View>

              {/* Colonne des Activités (80%) */}
              <View style={{ width: '80%', flexDirection: 'column', boxSizing: 'border-box' as any }}>
                {(axe.activites || []).map((act: any, acIdx: number) => (
                  <View key={acIdx} style={{ flexDirection: 'row', borderBottomWidth: acIdx < (axe.activites || []).length - 1 ? 1 : 0, borderBottomColor: '#2a2a2a', boxSizing: 'border-box' as any }}>
                    
                    {config.colonnesPre.map((col, i) => (
                      <View key={i} style={{ width: col.largeur as any, padding: 6, borderRightWidth: 1, borderRightColor: '#2a2a2a', boxSizing: 'border-box' as any }}>
                        {renderInput(act, col, aIdx, acIdx)}
                      </View>
                    ))}

                    {/* Zone Périodes */}
                    <View style={{ width: config.periodesLargeur as any, flexDirection: 'row', borderRightWidth: 1, borderRightColor: '#2a2a2a', minHeight: 72, boxSizing: 'border-box' as any }}>
                      {config.periodesLabels.map((p, pIdx) => {
                        const key = `${config.dataKey}-${aIdx}-${acIdx}-${p}`;
                        const isOpen = pickerKey === key;
                        const currentColor = act[config.periodesKey][p];
                        
                        return (
                          <View key={pIdx} style={{ flex: 1, borderRightWidth: pIdx < config.periodesLabels.length - 1 ? 1 : 0, borderRightColor: '#2a2a2a', boxSizing: 'border-box' as any }}>
                            <Pressable
                              onPress={() => openColorPicker(aIdx, acIdx, p)}
                              style={{ flex: 1, backgroundColor: currentColor || 'transparent', minHeight: 72, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 2, boxSizing: 'border-box' as any }}
                            >
                              {currentColor ? null : (
                                <Text style={{ color: '#555', fontSize: 9, textAlign: 'center' }}>{p}</Text>
                              )}
                            </Pressable>
                            {isOpen && (
                              <View style={{
                                position: 'absolute', top: 72, left: -10, zIndex: 999, backgroundColor: '#1a1a1a', borderWidth: 1, borderColor: '#444', borderRadius: 8, padding: 8, minWidth: 180, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.6, shadowRadius: 8, ...(Platform.OS === 'web' ? { boxShadow: '0 4px 16px rgba(0,0,0,0.7)' } as any : {})
                              }}>
                                {PERIODE_COLORS.map(({ color, label }) => (
                                  <Pressable
                                    key={color}
                                    onPress={() => setCouleur(aIdx, acIdx, p, color)}
                                    style={({ pressed }) => [{ flexDirection: 'row', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 8, borderRadius: 6, marginBottom: 2, backgroundColor: currentColor === color ? 'rgba(255,255,255,0.08)' : 'transparent' }, pressed && { opacity: 0.7 }]}
                                  >
                                    <View style={{ width: 16, height: 16, backgroundColor: color, borderRadius: 3, marginRight: 8 }} />
                                    <Text style={{ color: '#e5e7eb', fontSize: 12 }}>{label}</Text>
                                    {currentColor === color && (
                                      <Text style={{ color: color, marginLeft: 'auto', fontSize: 12, fontWeight: 'bold' }}>✓</Text>
                                    )}
                                  </Pressable>
                                ))}
                                <View style={{ height: 1, backgroundColor: '#333', marginVertical: 4 }} />
                                <Pressable onPress={() => setCouleur(aIdx, acIdx, p, null)} style={({ pressed }) => [{ flexDirection: 'row', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 8, borderRadius: 6 }, pressed && { opacity: 0.7 }]}>
                                  <View style={{ width: 16, height: 16, borderWidth: 1, borderColor: '#666', borderRadius: 3, marginRight: 8 }} />
                                  <Text style={{ color: '#9ca3af', fontSize: 12 }}>Effacer</Text>
                                </Pressable>
                              </View>
                            )}
                          </View>
                        );
                      })}
                    </View>

                    {config.colonnesPost.map((col, i) => (
                      <View key={i} style={{ width: col.largeur as any, padding: 4, borderRightWidth: 1, borderRightColor: '#2a2a2a', boxSizing: 'border-box' as any }}>
                        {renderInput(act, col, aIdx, acIdx)}
                      </View>
                    ))}

                    <View style={{ width: config.poubelleLargeur as any, justifyContent: 'center', alignItems: 'center', boxSizing: 'border-box' as any }}>
                      <Pressable onPress={() => rmActivite(aIdx, acIdx)} style={({ pressed }) => [{ padding: 4 }, pressed && { opacity: 0.5 }]}>
                        <Trash2 size={14} color="#ef4444" />
                      </Pressable>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>

        <View style={{ marginTop: 16, alignItems: 'flex-start' }}>
          <Pressable onPress={addAxe} style={({ pressed }) => [{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'transparent', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8, borderWidth: 1, borderColor: '#22c55e' }, pressed && { opacity: 0.7 }]}>
            <Text style={{ color: '#22c55e', fontSize: 14, fontWeight: 'bold' }}>＋ Ajouter un axe</Text>
          </Pressable>
        </View>

        <View style={{ marginTop: 24, flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
          {PERIODE_COLORS.map(({ color, label }) => (
            <View key={color} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 16, height: 16, backgroundColor: color, marginRight: 8, borderRadius: 2 }} />
              <Text style={{ color: '#a8a29e', fontSize: 12 }}>{label}</Text>
            </View>
          ))}
        </View>
      </Pressable>
    );
  };

  const renderFiche6 = () => (
    <View>
      {renderMatriceAxes({
        titreFiche: "FICHE 6 : MATRICE DE PLANIFICATION STRATEGIQUE",
        dataKey: 'planification',
        periodesKey: 'periodes',
        periodesTitre: 'Période',
        periodesLabels: ['A1', 'A2', 'A3', 'A4', 'A5'],
        periodesLargeur: '22.5%',
        colonnesPre: [
          { titre: "Objectifs", largeur: "20%", champ: "objectif", type: "multiline" },
          { titre: "Activités", largeur: "20%", champ: "activite", type: "multiline" },
          { titre: "Coût", largeur: "10%", champ: "cout", type: "montant" }
        ],
        colonnesPost: [
          { titre: "Responsable", largeur: "11.25%", champ: "responsable", type: "texte" },
          { titre: "Partenaires", largeur: "12.5%", champ: "partenaires", type: "texte" }
        ],
        poubelleLargeur: '3.75%'
      })}
      
      {renderMatriceAxes({
        titreFiche: "FICHE 7 : MATRICE DU PROGRAMME ANNUEL D'ACTION",
        dataKey: 'programmeAnnuel',
        periodesKey: 'chronogramme',
        periodesTitre: 'Chronogramme',
        periodesLabels: ['T1', 'T2', 'T3', 'T4'],
        periodesLargeur: '20%',
        colonnesPre: [
          { titre: "ACTIVITÉS/ACTIVITÉS", largeur: "27.5%", champ: "activite", type: "multiline" },
          { titre: "INDICATEURS", largeur: "27.5%", champ: "indicateur", type: "multiline" }
        ],
        colonnesPost: [
          { titre: "Responsable", largeur: "12.5%", champ: "responsable", type: "texte" },
          { titre: "Coût", largeur: "10%", champ: "cout", type: "montant" }
        ],
        poubelleLargeur: '2.5%'
      })}
    </View>
  );


  // Le renderFiche7 a été fusionné avec renderFiche6, donc on renvoie null ou un composant vide pour la Fiche 7 pour l'instant (Moyens/Coûts)
  
  // ================= FICHE 8 : MOYENS ET COÛTS =================
  const renderFiche8 = () => {
    const defaultData = [
      {
        id: '1', nom: 'Investissement', items: [
          { moyen: 'Atomiseur', unite: 'Nombre', a1q: '', a1c: '', a2q: '', a2c: '', a3q: '', a3c: '', a4q: '', a4c: '', a5q: '', a5c: '', fixed: true },
          { moyen: 'Sécateur professionnel', unite: 'Nombre', a1q: '', a1c: '', a2q: '', a2c: '', a3q: '', a3c: '', a4q: '', a4c: '', a5q: '', a5c: '', fixed: false }
        ]
      },
      {
        id: '2', nom: 'Intrants', items: [
          { moyen: 'Engrais NPK 12-12-17', unite: 'kg', a1q: '', a1c: '', a2q: '', a2c: '', a3q: '', a3c: '', a4q: '', a4c: '', a5q: '', a5c: '', fixed: true },
          { moyen: 'Insecticide (Confidor)', unite: 'Litre', a1q: '', a1c: '', a2q: '', a2c: '', a3q: '', a3c: '', a4q: '', a4c: '', a5q: '', a5c: '', fixed: true },
          { moyen: 'Fongicide (Ridomil)', unite: 'Litre', a1q: '', a1c: '', a2q: '', a2c: '', a3q: '', a3c: '', a4q: '', a4c: '', a5q: '', a5c: '', fixed: false },
          { moyen: 'Plants cacao CNRA', unite: 'Plants', a1q: '', a1c: '', a2q: '', a2c: '', a3q: '', a3c: '', a4q: '', a4c: '', a5q: '', a5c: '', fixed: false }
        ]
      },
      {
        id: '3', nom: 'Main d\'œuvre', items: [
          { moyen: 'M.O permanente', unite: 'Jours/an', a1q: '', a1c: '', a2q: '', a2c: '', a3q: '', a3c: '', a4q: '', a4c: '', a5q: '', a5c: '', fixed: true },
          { moyen: 'M.O. Occasionnelle (récolte)', unite: 'Jours', a1q: '', a1c: '', a2q: '', a2c: '', a3q: '', a3c: '', a4q: '', a4c: '', a5q: '', a5c: '', fixed: true }
        ]
      },
      {
        id: '4', nom: 'Activités spécifiques', items: [
          { moyen: 'Transport récolte (mototaxi)', unite: 'Saisons', a1q: '', a1c: '', a2q: '', a2c: '', a3q: '', a3c: '', a4q: '', a4c: '', a5q: '', a5c: '', fixed: true }
        ]
      },
      {
        id: '5', nom: 'Nouveau groupe', items: []
      }
    ];

    const f8Data = data.moyensCouts && data.moyensCouts.length > 0 ? data.moyensCouts : defaultData;

    const upGroup = (gIdx: number, val: string) => {
      const arr = JSON.parse(JSON.stringify(f8Data));
      arr[gIdx].nom = val;
      update('moyensCouts', arr);
    };

    const addGroup = () => {
      const arr = JSON.parse(JSON.stringify(f8Data));
      arr.push({ id: Date.now().toString(), nom: 'Nouveau groupe', items: [] });
      update('moyensCouts', arr);
    };

    const addRow = (gIdx: number) => {
      const arr = JSON.parse(JSON.stringify(f8Data));
      arr[gIdx].items.push({ moyen: '', unite: '', a1q: '', a1c: '', a2q: '', a2c: '', a3q: '', a3c: '', a4q: '', a4c: '', a5q: '', a5c: '', fixed: false });
      update('moyensCouts', arr);
    };

    const rmRow = (gIdx: number, rIdx: number) => {
      const arr = JSON.parse(JSON.stringify(f8Data));
      arr[gIdx].items.splice(rIdx, 1);
      update('moyensCouts', arr);
    };

    const upRow = (gIdx: number, rIdx: number, field: string, val: string) => {
      const arr = JSON.parse(JSON.stringify(f8Data));
      arr[gIdx].items[rIdx][field] = val;
      update('moyensCouts', arr);
    };

    const renderInput = (gIdx: number, rIdx: number, field: string, val: string, isNumeric: boolean = false) => (
      <RNTextInput
        value={val}
        onChangeText={(v: any) => upRow(gIdx, rIdx, field, v)}
        keyboardType={isNumeric ? "numeric" : "default"}
        style={{ width: '100%', backgroundColor: '#1a1a1a', borderWidth: 1, borderColor: '#333', borderRadius: 4, paddingHorizontal: 4, paddingVertical: 6, color: '#fff', fontSize: 11, textAlign: isNumeric ? 'center' : 'left', boxSizing: 'border-box' as any, ...(Platform.OS === 'web' ? { outlineStyle: 'none' } as any : {}) }}
      />
    );

    return (
      <View style={{ padding: 16, paddingBottom: 64 }}>
        <Text style={styles.ficheMainTitle}>
            <Text style={{color: '#3b82f6'}}>◆</Text> FICHE 8 : TABLEAU DE DETERMINATION DES MOYENS ET DES COUTS
          </Text>

        <View style={{ width: '100%', backgroundColor: '#0a0a0a', borderWidth: 1, borderColor: '#2a2a2a', borderRadius: 0, boxSizing: 'border-box' as any }}>
          {/* Header row 1 */}
          <View style={{ flexDirection: 'row', backgroundColor: '#000', borderBottomWidth: 1, borderBottomColor: '#2a2a2a' }}>
            <View style={{ width: '18%', borderRightWidth: 1, borderRightColor: '#2a2a2a', justifyContent: 'center', boxSizing: 'border-box' as any }}>
              <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold', textAlign: 'center' }}>Moyens spécifiques</Text>
            </View>
            <View style={{ width: '9%', borderRightWidth: 1, borderRightColor: '#2a2a2a', justifyContent: 'center', boxSizing: 'border-box' as any }}>
              <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold', textAlign: 'center' }}>Unités</Text>
            </View>
            
            {[1, 2, 3, 4, 5].map(annee => (
              <View key={annee} style={{ width: '14%', borderRightWidth: 1, borderRightColor: '#2a2a2a', boxSizing: 'border-box' as any }}>
                <View style={{ borderBottomWidth: 1, borderBottomColor: '#2a2a2a', paddingVertical: 8, boxSizing: 'border-box' as any }}>
                  <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold', textAlign: 'center' }}>Année {annee}</Text>
                </View>
                <View style={{ flexDirection: 'row', height: 30, boxSizing: 'border-box' as any }}>
                  <View style={{ flex: 1, borderRightWidth: 1, borderRightColor: '#2a2a2a', justifyContent: 'center', boxSizing: 'border-box' as any }}>
                    <Text style={{ color: '#fff', fontSize: 11, textAlign: 'center' }}>Qté</Text>
                  </View>
                  <View style={{ flex: 1, justifyContent: 'center', boxSizing: 'border-box' as any }}>
                    <Text style={{ color: '#fff', fontSize: 11, textAlign: 'center' }}>Coût</Text>
                  </View>
                </View>
              </View>
            ))}

            <View style={{ width: '3%', justifyContent: 'center', alignItems: 'center', boxSizing: 'border-box' as any }}>
              <Trash2 size={16} color="#666" />
            </View>
          </View>

          {/* Body */}
          {f8Data.map((groupe: any, gIdx: number) => (
            <View key={groupe.id || gIdx} style={{ boxSizing: 'border-box' as any }}>
              {/* Group Header */}
              <View style={{ backgroundColor: '#2a2a2a', borderBottomWidth: 1, borderBottomColor: '#2a2a2a', padding: 8, flexDirection: 'row', alignItems: 'center', boxSizing: 'border-box' as any }}>
                <RNTextInput
                  value={groupe.nom}
                  onChangeText={(v: any) => upGroup(gIdx, v)}
                  style={{ color: '#fff', fontSize: 13, fontWeight: 'bold', flex: 1, ...(Platform.OS === 'web' ? { outlineStyle: 'none' } as any : {}) }}
                />
              </View>

              {/* Group Rows */}
              {groupe.items.map((row: any, rIdx: number) => (
                <View key={rIdx} style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#2a2a2a', boxSizing: 'border-box' as any }}>
                  <View style={{ width: '18%', padding: 6, borderRightWidth: 1, borderRightColor: '#2a2a2a', justifyContent: 'center', boxSizing: 'border-box' as any }}>
                    {row.fixed ? (
                      <Text style={{ color: '#e5e7eb', fontSize: 12 }}>· {row.moyen}</Text>
                    ) : (
                      renderInput(gIdx, rIdx, 'moyen', row.moyen)
                    )}
                  </View>
                  <View style={{ width: '9%', padding: 6, borderRightWidth: 1, borderRightColor: '#2a2a2a', justifyContent: 'center', boxSizing: 'border-box' as any }}>
                    {row.fixed ? (
                      <Text style={{ color: '#a3a3a3', fontSize: 11, textAlign: 'center' }}>{row.unite}</Text>
                    ) : (
                      renderInput(gIdx, rIdx, 'unite', row.unite)
                    )}
                  </View>

                  {[1, 2, 3, 4, 5].map(annee => (
                    <View key={annee} style={{ width: '14%', flexDirection: 'row', borderRightWidth: 1, borderRightColor: '#2a2a2a', boxSizing: 'border-box' as any }}>
                      <View style={{ flex: 1, padding: 4, borderRightWidth: 1, borderRightColor: '#2a2a2a', justifyContent: 'center', boxSizing: 'border-box' as any }}>
                        {renderInput(gIdx, rIdx, `a${annee}q`, row[`a${annee}q`], true)}
                      </View>
                      <View style={{ flex: 1, padding: 4, justifyContent: 'center', boxSizing: 'border-box' as any }}>
                        {renderInput(gIdx, rIdx, `a${annee}c`, row[`a${annee}c`], true)}
                      </View>
                    </View>
                  ))}

                  <View style={{ width: '3%', justifyContent: 'center', alignItems: 'center', boxSizing: 'border-box' as any }}>
                    {!row.fixed && (
                      <Pressable onPress={() => rmRow(gIdx, rIdx)} style={({ pressed }) => [{ padding: 4 }, pressed && { opacity: 0.5 }]}>
                        <Trash2 size={14} color="#ef4444" />
                      </Pressable>
                    )}
                  </View>
                </View>
              ))}

              {/* Add row for group */}
              <Pressable onPress={() => addRow(gIdx)} style={({ pressed }) => [{ padding: 12, borderBottomWidth: 1, borderBottomColor: '#2a2a2a', flexDirection: 'row', alignItems: 'center' }, pressed && { opacity: 0.7 }]}>
                <Text style={{ color: '#22c55e', fontSize: 12, fontWeight: 'bold' }}>+ Ajouter une ligne ({groupe.nom})</Text>
              </Pressable>
            </View>
          ))}
        </View>

        <View style={{ marginTop: 16, alignItems: 'flex-start' }}>
          <Pressable onPress={addGroup} style={({ pressed }) => [{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'transparent', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8, borderWidth: 1, borderColor: '#22c55e' }, pressed && { opacity: 0.7 }]}>
            <Text style={{ color: '#22c55e', fontSize: 14, fontWeight: 'bold' }}>＋ Ajouter un groupe</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  const currentRenderer = [renderFiche1, renderFiche2, renderFiche3, renderFiche4, renderFiche5, renderFiche6, renderFiche8][activeSection - 1];

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <ScrollView ref={scrollViewRef} style={styles.content} contentContainerStyle={styles.contentInner}>
      {/* HEADER */}
      {mode !== 'pdc' && (
        <View style={styles.mainHeader}>
          <View>
            <Text style={styles.mainHeaderTitle}>Fiche PDC</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
              <Star size={16} color="#fbbf24" fill="#fbbf24" style={{ marginRight: 6 }} />
              <Text style={styles.mainHeaderSubtitle}>{data.nom || 'Nouveau Producteur'}</Text>
            </View>
          </View>
          <Button 
            title="Enregistrer" 
            variant="secondary" 
            icon={<Save size={18} color="#fff" />} 
            onPress={handleSubmit} 
            disabled={isSubmitting}
            style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
          />
        </View>
      )}
      
      {/* Tabs / Timeline */}
      <View style={styles.tabsContainerWrapper}>
        <View style={styles.tabsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScrollContent}>
            {(mode === 'pdc' ? [
              { id: 1, label: 'Fiche 1', ficheNum: 1 },
              { id: 2, label: 'Fiche 2', ficheNum: 2 },
              { id: 3, label: 'Fiche 3', ficheNum: 3 },
              { id: 4, label: 'Fiche 4', ficheNum: 4 },
              { id: 5, label: 'Fiche 5', ficheNum: 5 },
              { id: 6, label: 'Fiche 6-7', ficheNum: 6 },
              { id: 7, label: 'Fiche 8', ficheNum: 8 }
            ] : SECTIONS).map((sec: any, index) => {
              if (sec.type === 'separator') {
                return (
                  <View key={`sep-${index}`} style={styles.tabSeparator}>
                    <Text style={styles.tabSeparatorText}>{sec.label}</Text>
                  </View>
                );
              }
              const isActive = activeSection === sec.id;
              let completionLabel = '';
              let isComplete = false;
              if (mode === 'pdc') {
                const perc = calculateFicheCompletion(data, sec.ficheNum);
                isComplete = perc === 100;
                completionLabel = isComplete ? ' ✓' : ` ${perc}%`;
              }
              const isLocked = sec.id > highestSectionVisited;
              return (
                <Pressable
                  key={sec.id}
                  onPress={() => {
                    if (!isLocked) setActiveSection(sec.id);
                  }}
                  style={[
                    styles.tabBtn,
                    isActive && styles.tabBtnActive,
                    isLocked && { opacity: 0.4 }
                  ]}
                >
                  {sec.icon && <sec.icon size={16} color={isActive ? colors.primaryLight : colors.textSecondary} style={{ marginRight: 8 }} />}
                  <Text style={[
                    styles.tabText,
                    isActive && styles.tabTextActive
                  ]}>
                    {mode === 'pdc' ? sec.label : (sec.displayId ? `Fiche ${sec.displayId} - ${sec.label}` : `Fiche ${sec.id} - ${sec.label}`)}
                    {mode === 'pdc' && <Text style={{ color: isComplete ? '#22c55e' : '#fbbf24', fontSize: 10 }}>{completionLabel}</Text>}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </View>

      {/* Content Wrapped in Green Border Box */}
        <View style={styles.contentWrapper}>
          <Animated.View key={activeSection} entering={FadeIn.duration(250)} style={{ flex: 1 }}>
            {currentRenderer()}
          </Animated.View>
        </View>

        {/* Footer Navigation Buttons */}
        <View style={styles.footerNavigation}>
          <Pressable 
            onPress={handlePrev}
            style={({ pressed }) => [styles.footerBtnPrev, pressed && { opacity: 0.7 }, activeSection === 1 && { opacity: 0.3 }]}
            disabled={activeSection === 1}
          >
            <Text style={styles.footerBtnPrevText}>&lt;  Précédent</Text>
          </Pressable>
          <Pressable 
            onPress={activeSection === 7 ? () => onSubmit?.(data) : handleNext}
            style={({ pressed }) => [styles.footerBtnNext, pressed && { opacity: 0.7 }, isSubmitting && { opacity: 0.5 }]}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.footerBtnNextText}>{activeSection === 7 ? "Terminer l'enregistrement" : "Suivant  >"}</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
});

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  mainHeader: {
    marginTop: Platform.OS === 'ios' ? 40 : 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
    backgroundColor: colors.background,
  },
  mainHeaderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  mainHeaderSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
    tabsContainerWrapper: {
    marginHorizontal: spacing.xl,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  tabsContainer: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
    borderRadius: radius.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  tabsScrollContent: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  tabSeparator: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    justifyContent: 'center',
    borderLeftWidth: 2,
    borderLeftColor: '#ef4444',
    marginHorizontal: spacing.xs,
  },
  tabSeparatorText: {
    color: '#ef4444',
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  stepWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabBtnActive: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)', // Fond vert clair
    borderColor: '#22c55e', // Bordure verte
  },
  tabBtnCompleted: {
    backgroundColor: 'transparent',
  },
  tabBtnUpcoming: {
    backgroundColor: 'transparent',
  },
  tabNumberCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  tabNumberCircleActive: {
    backgroundColor: '#22c55e',
  },
  tabNumberCircleCompleted: {
    backgroundColor: '#22c55e',
  },
  tabNumberCircleUpcoming: {
    backgroundColor: colors.border,
  },
  tabNumberText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  tabNumberTextActive: {
    color: '#fff',
  },
  tabNumberTextUpcoming: {
    color: colors.textMuted,
  },
  tabText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
  tabTextActive: {
    color: colors.primary,
  },
  tabTextCompleted: {
    color: colors.primary,
  },
  tabTextUpcoming: {
    color: colors.text,
  },
  stepConnector: {
    width: 16,
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.xs,
  },
  content: {
    flex: 1,
  },
  contentInner: {
    paddingBottom: spacing.xxl,
  },
  contentWrapper: {
    marginHorizontal: spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(22, 101, 52, 0.6)',
    borderRadius: 12,
    padding: spacing.xl,
    backgroundColor: colors.surface,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerBtn: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  sectionContainer: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  cardWrapper: {
    padding: spacing.md,
  },
  label: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  note: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    fontStyle: 'italic',
    marginBottom: spacing.md,
  },
  itemCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  itemTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  deleteText: {
    color: colors.error,
    fontSize: typography.sizes.xs,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  flexHalf: {
    flex: 1,
  },
  // NOUVEAUX STYLES POUR LA FICHE PDC
    cacaoyereGrid: {
    flexDirection: Platform.OS === 'web' && Dimensions.get('window').width > 768 ? 'row' : 'column',
    gap: spacing.lg,
  },
  cacaoyereCol: {
    flex: 1,
    gap: spacing.lg,
  },
  ficheContainer: {
    paddingVertical: spacing.lg,
  },
  ficheHeader: {
    marginBottom: spacing.xl,
  },
  ficheAnnexeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ef4444',
    marginBottom: spacing.md,
  },
  ficheMainTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3b82f6',
    textTransform: 'uppercase',
    marginBottom: 24,
  },
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
  requiredNotice: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  requiredStar: {
    color: '#ef4444',
    fontWeight: 'bold',
  },
  gridContainer: {
    gap: spacing.sm,
  },
  gridRow: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    gap: spacing.sm,
  },
  gridCol: {
    flex: 1,
  },
  tableScroll: {
    marginTop: spacing.md,
  },
  tableContainer: {
    flexDirection: 'column',
    minWidth: 1130,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    minWidth: 1130,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  tableHeader: {
    flexDirection: 'row',
    minWidth: 1130,
    backgroundColor: '#000',
  },
  tableCell: {
    padding: spacing.xs,
    justifyContent: 'flex-start',
    flexShrink: 0,
  },
  tableHeaderCell: {
    fontWeight: 'bold',
    fontSize: 11,
    color: '#fff',
    paddingVertical: spacing.sm,
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
  footerNavigation: {
    marginHorizontal: spacing.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xl,
    paddingBottom: spacing.xl,
  },
  footerBtnPrev: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
  },
  footerBtnPrevText: {
    color: colors.textSecondary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  footerBtnNext: {
    backgroundColor: '#16a34a',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
  },
  footerBtnNextText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  }
});
