import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, LayoutAnimation } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react-native';
import { usePreferences } from '../contexts/PreferencesContext';
import { Spacing, Radius, Shadows } from '../constants/Colors';

const faqs = [
  {
    question: "Como funciona um pedido sustentável?",
    answer: "Trabalhamos com restaurantes locais que utilizam embalagens biodegradáveis, recicláveis ou reutilizáveis. Nossa logística busca rotas otimizadas e entregas por bicicleta sempre que possível."
  },
  {
    question: "Posso cancelar um pedido em andamento?",
    answer: "Você pode cancelar o pedido se o restaurante ainda não tiver começado a prepará-lo. Basta acessar a aba 'Pedidos' e clicar em 'Cancelar'."
  },
  {
    question: "Faltou um item no meu pedido, o que faço?",
    answer: "Pedimos desculpas! Entre em contato conosco via WhatsApp ou e-mail na aba Perfil informando o número do pedido e nós resolveremos imediatamente com o restaurante ou emitiremos um reembolso."
  },
  {
    question: "Quais são as formas de pagamento aceitas?",
    answer: "Aceitamos Pix, Cartão de Crédito (Visa, Mastercard, Elo) e Cartões de Vale-Alimentação e Refeição (VA/VR). Adicione suas opções na área 'Formas de Pagamento' do perfil."
  }
];

export default function Help() {
  const router = useRouter();
  const { colors } = usePreferences();
  const styles = React.useMemo(() => getStyles(colors), [colors]);
  
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ajuda e Suporte</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <View style={styles.iconGlow}>
            <HelpCircle size={40} color={colors.primary} />
          </View>
          <Text style={styles.title}>Como podemos ajudar?</Text>
          <Text style={styles.subtitle}>
            Confira as perguntas frequentes abaixo. Se não encontrar o que procura, utilize nossos contatos de suporte no perfil principal.
          </Text>
        </View>

        <View style={styles.faqList}>
          {faqs.map((faq, index) => {
            const isExpanded = expandedIndex === index;
            return (
              <TouchableOpacity 
                key={index} 
                style={styles.faqItem} 
                onPress={() => toggleExpand(index)}
                activeOpacity={0.7}
              >
                <View style={styles.faqHeader}>
                  <Text style={[styles.faqQuestion, isExpanded && styles.faqQuestionActive]}>
                    {faq.question}
                  </Text>
                  {isExpanded ? (
                    <ChevronUp size={20} color={colors.primary} />
                  ) : (
                    <ChevronDown size={20} color={colors.textTertiary} />
                  )}
                </View>
                
                {isExpanded && (
                  <View style={styles.faqAnswerContainer}>
                    <Text style={styles.faqAnswer}>{faq.answer}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    height: 60,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  scrollContent: {
    padding: Spacing.xl,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    backgroundColor: colors.primary + '0A',
    padding: Spacing.xl,
    borderRadius: Radius.xl,
  },
  iconGlow: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary + '1A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.textPrimary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  faqList: {
    marginTop: 0,
  },
  faqItem: {
    backgroundColor: colors.surface,
    borderRadius: Radius.xl,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    ...Shadows.medium,
    borderWidth: 1,
    borderColor: colors.border + '50',
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
  },
  faqQuestion: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginRight: Spacing.md,
  },
  faqQuestionActive: {
    color: colors.primary,
  },
  faqAnswerContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  faqAnswer: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  }
});
