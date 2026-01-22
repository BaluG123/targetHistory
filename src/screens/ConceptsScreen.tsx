import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { timeSystemExplanation } from '../data/historicalData';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';

interface Concept {
  id: string;
  title: string;
  description: string;
  category: 'timeline' | 'political' | 'cultural' | 'economic' | 'social';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  content: string;
  examples?: string[];
  relatedConcepts?: string[];
}

const ConceptsScreen = () => {
  const { user } = useSelector((state: RootState) => state);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedConcept, setSelectedConcept] = useState<Concept | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const isDark = user.preferences.theme === 'dark';
  const styles = createStyles(isDark);

  const concepts: Concept[] = [
    {
      id: '1',
      title: 'AD, BC, BCE, CE System',
      description: 'Understanding the dating system used in history',
      category: 'timeline',
      difficulty: 'beginner',
      content: timeSystemExplanation.content,
      examples: [
        '500 BC = 500 years before Christ\'s birth',
        '1500 AD = 1500 years after Christ\'s birth',
        'BCE and CE are secular alternatives to BC and AD'
      ],
      relatedConcepts: ['Timeline', 'Chronology', 'Historical Dating']
    },
    {
      id: '2',
      title: 'Empire vs Kingdom',
      description: 'Difference between empires and kingdoms in historical context',
      category: 'political',
      difficulty: 'beginner',
      content: `
**Empire**: A large political unit having a territory of great extent or a number of territories or peoples under a single sovereign authority.

**Kingdom**: A country, state, or territory ruled by a king or queen.

**Key Differences:**
- **Size**: Empires are typically larger and encompass multiple regions/cultures
- **Diversity**: Empires often include diverse populations and cultures
- **Administration**: Empires require more complex administrative systems
- **Expansion**: Empires are usually formed through conquest and expansion

**Examples:**
- **Empires**: Roman Empire, Mauryan Empire, British Empire
- **Kingdoms**: Kingdom of Magadha, Kingdom of Mysore, Kingdom of France
      `,
      examples: [
        'Mauryan Empire covered most of Indian subcontinent',
        'Kingdom of Magadha was limited to present-day Bihar',
        'Roman Empire spanned three continents'
      ],
      relatedConcepts: ['Political Systems', 'Governance', 'Territory']
    },
    {
      id: '3',
      title: 'Dynasty',
      description: 'Understanding royal dynasties and succession',
      category: 'political',
      difficulty: 'beginner',
      content: `
**Dynasty**: A line of hereditary rulers of a country or empire.

**Characteristics:**
- **Hereditary Rule**: Power passes from parent to child
- **Family Lineage**: Multiple generations of the same family
- **Continuity**: Maintains similar policies and traditions
- **Legitimacy**: Claims authority through bloodline

**Types:**
- **Patrilineal**: Succession through male line
- **Matrilineal**: Succession through female line (rare)
- **Elective**: Family members elected to rule

**Famous Indian Dynasties:**
- Mauryan Dynasty (321-185 BCE)
- Gupta Dynasty (320-550 CE)
- Mughal Dynasty (1526-1857 CE)
- Chola Dynasty (300 BCE-1279 CE)
      `,
      examples: [
        'Mauryan Dynasty: Chandragupta → Bindusara → Ashoka',
        'Mughal Dynasty: Babur → Humayun → Akbar → Jahangir',
        'Gupta Dynasty: Chandragupta I → Samudragupta → Chandragupta II'
      ],
      relatedConcepts: ['Succession', 'Royal Family', 'Hereditary Rule']
    },
    {
      id: '4',
      title: 'Feudalism',
      description: 'The feudal system of medieval times',
      category: 'social',
      difficulty: 'intermediate',
      content: `
**Feudalism**: A hierarchical system of land ownership and duties that characterized medieval Europe and parts of Asia.

**Key Features:**
- **Land Grants**: Lords granted land (fiefs) to vassals
- **Military Service**: Vassals provided military service in return
- **Hierarchy**: Clear social hierarchy from king to peasants
- **Personal Bonds**: Relationships based on personal loyalty

**Social Structure:**
1. **King/Emperor**: Ultimate owner of all land
2. **Lords/Nobles**: Granted large estates by the king
3. **Knights/Warriors**: Professional soldiers serving lords
4. **Peasants/Serfs**: Worked the land, bound to the estate

**In India:**
- Similar systems existed in medieval India
- Jagirdari system under Mughals
- Zamindari system in various regions
      `,
      examples: [
        'European feudalism: King → Duke → Baron → Knight → Peasant',
        'Jagirdari system: Emperor granted jagirs to nobles',
        'Mansabdari system under Akbar'
      ],
      relatedConcepts: ['Social Hierarchy', 'Land Ownership', 'Medieval Society']
    },
    {
      id: '5',
      title: 'Trade Routes',
      description: 'Ancient and medieval trade networks',
      category: 'economic',
      difficulty: 'intermediate',
      content: `
**Trade Routes**: Networks of paths and roads used by merchants to transport goods across regions.

**Major Ancient Trade Routes:**

**1. Silk Road**
- Connected China to Mediterranean
- Facilitated exchange of silk, spices, ideas
- Multiple routes across Central Asia

**2. Grand Trunk Road**
- Connected Bengal to Afghanistan
- Built by Sher Shah Suri, improved by Mughals
- Facilitated trade and administration

**3. Maritime Routes**
- Indian Ocean trade network
- Connected India to Southeast Asia, Arabia, Africa
- Monsoon-dependent sailing

**4. Spice Routes**
- Connected India to Europe
- High-value spices like pepper, cardamom
- Led to European exploration of sea routes

**Impact:**
- Cultural exchange and diffusion
- Spread of religions (Buddhism, Islam)
- Economic prosperity of trading cities
- Development of banking and credit systems
      `,
      examples: [
        'Silk Road brought Buddhism from India to China',
        'Spice trade made Kerala ports wealthy',
        'Grand Trunk Road connected Calcutta to Kabul'
      ],
      relatedConcepts: ['Commerce', 'Cultural Exchange', 'Transportation']
    },
    {
      id: '6',
      title: 'Colonialism',
      description: 'The practice of acquiring and maintaining colonies',
      category: 'political',
      difficulty: 'advanced',
      content: `
**Colonialism**: The practice of acquiring full or partial political control over another country, occupying it with settlers, and exploiting it economically.

**Types of Colonialism:**

**1. Settlement Colonialism**
- Large-scale immigration of colonizers
- Displacement of indigenous populations
- Examples: Australia, North America

**2. Exploitation Colonialism**
- Focus on resource extraction
- Minimal settlement
- Examples: Most of Africa, parts of Asia

**3. Surrogate Colonialism**
- Control through local intermediaries
- Indirect rule
- Examples: Princely states in India

**Colonial Methods:**
- **Economic**: Resource extraction, trade monopolies
- **Political**: Direct/indirect rule, divide and rule
- **Cultural**: Education, language, religion
- **Military**: Superior technology, local alliances

**Impact on India:**
- Deindustrialization
- Drain of wealth
- Social and cultural changes
- Infrastructure development (railways, telegraphs)
- Administrative systems
      `,
      examples: [
        'British East India Company\'s gradual control',
        'Doctrine of Lapse policy',
        'Permanent Settlement in Bengal'
      ],
      relatedConcepts: ['Imperialism', 'Economic Exploitation', 'Cultural Impact']
    }
  ];

  const categories = [
    { id: 'all', label: 'All Concepts', icon: 'apps' },
    { id: 'timeline', label: 'Timeline', icon: 'timeline' },
    { id: 'political', label: 'Political', icon: 'account-balance' },
    { id: 'cultural', label: 'Cultural', icon: 'palette' },
    { id: 'economic', label: 'Economic', icon: 'trending-up' },
    { id: 'social', label: 'Social', icon: 'people' },
  ];

  const filteredConcepts = concepts.filter(concept => {
    const matchesSearch = concept.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         concept.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || concept.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '#4CAF50';
      case 'intermediate': return '#FF9800';
      case 'advanced': return '#F44336';
      default: return '#666';
    }
  };

  const CategoryButton = ({ category }: { category: any }) => (
    <TouchableOpacity
      onPress={() => setSelectedCategory(category.id)}
      style={[
        styles.categoryButton,
        selectedCategory === category.id && styles.activeCategoryButton
      ]}
    >
      <Icon 
        name={category.icon} 
        size={20} 
        color={selectedCategory === category.id ? '#fff' : '#666'} 
      />
      <Text style={[
        styles.categoryButtonText,
        selectedCategory === category.id && styles.activeCategoryButtonText
      ]}>
        {category.label}
      </Text>
    </TouchableOpacity>
  );

  const ConceptCard = ({ concept }: { concept: Concept }) => (
    <TouchableOpacity
      onPress={() => {
        setSelectedConcept(concept);
        setModalVisible(true);
      }}
      activeOpacity={0.8}
    >
      <Animatable.View animation="fadeInUp" style={styles.conceptCard}>
        <View style={styles.conceptHeader}>
          <Text style={styles.conceptTitle}>{concept.title}</Text>
          <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(concept.difficulty) }]}>
            <Text style={styles.difficultyText}>{concept.difficulty}</Text>
          </View>
        </View>
        <Text style={styles.conceptDescription}>{concept.description}</Text>
        <View style={styles.conceptFooter}>
          <View style={[styles.categoryTag, { backgroundColor: '#FF6B35' }]}>
            <Text style={styles.categoryTagText}>{concept.category}</Text>
          </View>
          <Icon name="arrow-forward" size={20} color="#FF6B35" />
        </View>
      </Animatable.View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={isDark ? ['#2C3E50', '#34495E'] : ['#FF6B35', '#F7931E']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Historical Concepts</Text>
        <Text style={styles.headerSubtitle}>Master key historical terms and ideas</Text>
      </LinearGradient>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search concepts..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
        {categories.map(category => (
          <CategoryButton key={category.id} category={category} />
        ))}
      </ScrollView>

      {/* Concepts List */}
      <ScrollView style={styles.conceptsList} showsVerticalScrollIndicator={false}>
        {filteredConcepts.map(concept => (
          <ConceptCard key={concept.id} concept={concept} />
        ))}
      </ScrollView>

      {/* Concept Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedConcept?.title}</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            {selectedConcept && (
              <ScrollView style={styles.modalBody}>
                <View style={styles.conceptMeta}>
                  <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(selectedConcept.difficulty) }]}>
                    <Text style={styles.difficultyText}>{selectedConcept.difficulty}</Text>
                  </View>
                  <View style={[styles.categoryTag, { backgroundColor: '#FF6B35' }]}>
                    <Text style={styles.categoryTagText}>{selectedConcept.category}</Text>
                  </View>
                </View>

                <Text style={styles.conceptContent}>{selectedConcept.content}</Text>

                {selectedConcept.examples && selectedConcept.examples.length > 0 && (
                  <View style={styles.examplesContainer}>
                    <Text style={styles.sectionTitle}>Examples:</Text>
                    {selectedConcept.examples.map((example, index) => (
                      <Text key={index} style={styles.exampleText}>• {example}</Text>
                    ))}
                  </View>
                )}

                {selectedConcept.relatedConcepts && selectedConcept.relatedConcepts.length > 0 && (
                  <View style={styles.relatedContainer}>
                    <Text style={styles.sectionTitle}>Related Concepts:</Text>
                    <View style={styles.relatedTags}>
                      {selectedConcept.relatedConcepts.map((related, index) => (
                        <View key={index} style={styles.relatedTag}>
                          <Text style={styles.relatedTagText}>{related}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const createStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#121212' : '#f5f5f5',
  },
  header: {
    padding: 20,
    paddingTop: 50,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
    marginTop: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? '#1E1E1E' : '#fff',
    margin: 20,
    borderRadius: 25,
    paddingHorizontal: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: isDark ? '#fff' : '#333',
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: isDark ? '#2C2C2C' : '#e0e0e0',
    marginRight: 10,
  },
  activeCategoryButton: {
    backgroundColor: '#FF6B35',
  },
  categoryButtonText: {
    marginLeft: 8,
    fontSize: 14,
    color: isDark ? '#fff' : '#666',
  },
  activeCategoryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  conceptsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  conceptCard: {
    backgroundColor: isDark ? '#1E1E1E' : '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  conceptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  conceptTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: isDark ? '#fff' : '#333',
    flex: 1,
    marginRight: 10,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  conceptDescription: {
    fontSize: 14,
    color: isDark ? '#ccc' : '#666',
    lineHeight: 20,
    marginBottom: 15,
  },
  conceptFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryTagText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: isDark ? '#1E1E1E' : '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#333' : '#e0e0e0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: isDark ? '#fff' : '#333',
    flex: 1,
  },
  closeButton: {
    padding: 5,
  },
  modalBody: {
    padding: 20,
  },
  conceptMeta: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  conceptContent: {
    fontSize: 16,
    color: isDark ? '#ccc' : '#666',
    lineHeight: 24,
    marginBottom: 20,
  },
  examplesContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: isDark ? '#fff' : '#333',
    marginBottom: 10,
  },
  exampleText: {
    fontSize: 14,
    color: isDark ? '#ccc' : '#666',
    marginBottom: 5,
    paddingLeft: 10,
  },
  relatedContainer: {
    marginBottom: 20,
  },
  relatedTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  relatedTag: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  relatedTagText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
});

export default ConceptsScreen;