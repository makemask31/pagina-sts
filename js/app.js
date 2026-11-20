/**
 * STS · Scalari Tech System - Main Application Logic
 * Comprehensive interactive behaviors:
 * 1. Dark/Light Theme Switcher & System Sync
 * 2. Responsive Mobile Drawer & Scroll Spy
 * 3. Dynamic WhatsApp Chips Selector & Live Preview
 * 4. Interactive Project Budget & Delivery Calculator
 * 5. Detailed Solution Modal with Service Specifications
 * 6. Interactive Cybersecurity Auditor Simulation
 * 7. Live Interactive Portfolio & Mockup Tabs
 * 8. FAQ Accordion with smooth transitions
 * 9. Masked & Validated Lead Capture Form (WhatsApp & Email)
 * 10. Floating WhatsApp Chat Widget & Toast Notifications
 */

document.addEventListener('DOMContentLoaded', () => {
  // Config
  const STS_PHONE = "5519983326884"; // STS official WhatsApp (Amparo - SP)

  /* ==========================================================================
     1. Toast Notification System
     ========================================================================== */
  const toastContainer = document.getElementById('toast-container');

  function showToast(message, type = 'success', duration = 4000) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const iconSvg = type === 'success' 
      ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#12a36b" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>'
      : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e11d48" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';

    toast.innerHTML = `${iconSvg}<span>${message}</span>`;
    toastContainer.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  /* ==========================================================================
     2. Dark / Light Theme Controller
     ========================================================================== */
  const themeToggle = document.getElementById('theme-toggle');
  const root = document.documentElement;

  // Retrieve saved preference or system default
  const savedTheme = localStorage.getItem('sts-theme');
  if (savedTheme) {
    root.setAttribute('data-theme', savedTheme);
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = root.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', newTheme);
      localStorage.setItem('sts-theme', newTheme);
      showToast(`Tema alterado para modo ${newTheme === 'dark' ? 'escuro' : 'claro'}.`, 'success', 2000);
    });
  }

  /* ==========================================================================
     3. Scroll Progress & Back to Top & Scroll Spy
     ========================================================================== */
  const scrollProgress = document.getElementById('scroll-progress');
  const backToTop = document.getElementById('back-to-top');
  const navLinks = document.querySelectorAll('nav .nav-links a:not(.btn)');
  const sections = document.querySelectorAll('section[id], header[id]');

  window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;

    if (scrollProgress) {
      scrollProgress.style.width = scrolled + '%';
    }

    if (backToTop) {
      if (winScroll > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }

    // Scroll spy
    let current = '';
    sections.forEach(sec => {
      const secTop = sec.offsetTop - 120;
      if (winScroll >= secTop) {
        current = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (current && link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ==========================================================================
     4. Mobile Navigation Drawer
     ========================================================================== */
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      mobileToggle.classList.toggle('active', isOpen);
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close when clicking a drawer link
    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (mobileDrawer.classList.contains('open') &&
          !mobileDrawer.contains(e.target) &&
          !mobileToggle.contains(e.target)) {
        mobileDrawer.classList.remove('open');
        mobileToggle.classList.remove('active');
      }
    });
  }

  /* ==========================================================================
     5. Preset Chips Selector (Dynamic WhatsApp Link & Message Generator)
     ========================================================================== */
  const chipOptions = [
    "Cardápio digital",
    "Pedidos pelo WhatsApp",
    "Landing page",
    "Site institucional",
    "Catálogo online",
    "Loja virtual",
    "Blog",
    "Automação de atendimento",
    "Projeto sob medida"
  ];

  let selectedChips = [];
  const chipsBox = document.getElementById("chips");
  const waBtn1 = document.getElementById("wa");
  const waBtnHero = document.getElementById("wa-hero");
  const waBtnHero2 = document.getElementById("wa-hero2");
  const waBtnCta = document.getElementById("wa2");
  const waPreviewText = document.getElementById("wa-preview-text");
  const selectAllBtn = document.getElementById("chips-select-all");
  const clearAllBtn = document.getElementById("chips-clear-all");

  function getWhatsAppMessage(items = selectedChips) {
    let msg = "Olá, STS! Vim pelo site da Scalari Tech System e gostaria de solicitar um orçamento";
    if (items.length > 0) {
      msg += " para os seguintes itens:\n- " + items.join("\n- ");
    } else {
      msg += " para um projeto de tecnologia.";
    }
    return msg;
  }

  function getWhatsAppUrl(items = selectedChips) {
    const text = getWhatsAppMessage(items);
    return `https://wa.me/${STS_PHONE}?text=${encodeURIComponent(text)}`;
  }

  function updateWhatsAppLinks() {
    const url = getWhatsAppUrl();
    const msg = getWhatsAppMessage();

    if (waBtn1) waBtn1.href = url;
    if (waBtnHero) waBtnHero.href = url;
    if (waBtnHero2) waBtnHero2.href = url;
    if (waBtnCta) waBtnCta.href = url;

    if (waPreviewText) {
      waPreviewText.textContent = `"${msg.replace(/\n/g, ' ')}"`;
    }
  }

  if (chipsBox) {
    chipOptions.forEach(opt => {
      const btn = document.createElement("button");
      btn.className = "chip";
      btn.type = "button";
      btn.setAttribute("aria-pressed", "false");
      btn.innerHTML = `<span class="chip-check">✓</span><span>${opt}</span>`;

      btn.addEventListener("click", () => {
        const index = selectedChips.indexOf(opt);
        if (index < 0) {
          selectedChips.push(opt);
          btn.setAttribute("aria-pressed", "true");
        } else {
          selectedChips.splice(index, 1);
          btn.setAttribute("aria-pressed", "false");
        }
        updateWhatsAppLinks();
      });

      chipsBox.appendChild(btn);
    });

    if (selectAllBtn) {
      selectAllBtn.addEventListener('click', () => {
        selectedChips = [...chipOptions];
        chipsBox.querySelectorAll('.chip').forEach(c => c.setAttribute('aria-pressed', 'true'));
        updateWhatsAppLinks();
        showToast("Todos os serviços foram selecionados!");
      });
    }

    if (clearAllBtn) {
      clearAllBtn.addEventListener('click', () => {
        selectedChips = [];
        chipsBox.querySelectorAll('.chip').forEach(c => c.setAttribute('aria-pressed', 'false'));
        updateWhatsAppLinks();
        showToast("Seleção limpa.", "success", 2000);
      });
    }

    updateWhatsAppLinks();
  }

  /* ==========================================================================
     6. Solutions Modal / Detailed Specifications
     ========================================================================== */
  const solutionsData = {
    'cardapio': {
      title: 'Cardápio Digital Responsivo',
      badge: 'Menos papel, mais vendas',
      desc: 'Ideal para bares, lanchonetes e restaurantes que desejam eliminar custos com impressão, atualizar preços em tempo real e encantar clientes com fotos atraentes e carregamento instantâneo via QR Code.',
      features: [
        'Acesso imediato via QR Code nas mesas ou balcão',
        'Painel simples para alterar preços, fotos e pratos em segundos',
        'Categorias organizadas (entradas, pratos, bebidas, sobremesas)',
        'Otimizado para conexões 3G/4G com carregamento abaixo de 1s',
        'Layout limpo, acessível e compatível com Android e iOS'
      ],
      timeframe: 'Prazo médio de entrega: 3 a 5 dias úteis',
      ctaText: 'Quero um Cardápio Digital'
    },
    'cardapio-wa': {
      title: 'Cardápio com Pedidos no WhatsApp',
      badge: 'Atendimento ágil & sem taxas de apps',
      desc: 'O cliente monta o pedido com acompanhamentos, adicionais e observações, escolhe entrega ou retirada, e a comanda chega 100% formatada e calculada diretamente no WhatsApp do seu estabelecimento.',
      features: [
        'Carrinho de compras intuitivo com cálculo de taxa de entrega',
        'Personalização de adicionais, combos e observações',
        'Comanda formatada enviada ao WhatsApp do atendente/balcão',
        'Zero cobrança de comissões por pedido vendido (economia total)',
        'Controle de horário de funcionamento e status da loja'
      ],
      timeframe: 'Prazo médio de entrega: 4 a 7 dias úteis',
      ctaText: 'Quero Cardápio com Pedidos'
    },
    'landing-page': {
      title: 'Landing Page de Alta Conversão',
      badge: 'Feita para converter visitantes em clientes',
      desc: 'Página única ultrarrápida, construída estrategicamente com técnicas de copy, design persuasivo e cibersegurança. Ideal para anúncios patrocinados (Meta Ads, Google Ads) e lançamentos de serviços.',
      features: [
        'Estrutura focada em conversão (Copywriting estruturado + CTAs claros)',
        'Pontuação 95+ no Google PageSpeed Insights para pagar menos no clique',
        'Integração direta com WhatsApp, Pixel do Facebook e Google Tag Manager',
        'Formulário inteligente com validação e proteção contra spam',
        'Hospedagem segura com certificado SSL/TLS vitalício'
      ],
      timeframe: 'Prazo médio de entrega: 3 a 6 dias úteis',
      ctaText: 'Quero uma Landing Page'
    },
    'site-institucional': {
      title: 'Site Institucional Profissional',
      badge: 'Mais credibilidade e autoridade para sua marca',
      desc: 'Presença digital robusta para clínicas, escritórios, consultorias, indústrias e empresas que precisam transmitir seriedade, apresentar seus diferenciais e conquistar grandes contratos.',
      features: [
        'Múltiplas páginas estruturadas (Quem Somos, Serviços, Casos, Contato)',
        'Otimização completa para aparecer nas buscas orgânicas do Google (SEO)',
        'Design exclusivo adaptado à identidade visual da sua marca',
        'Total conformidade com as diretrizes da LGPD (Segurança de Dados)',
        'Integração com Google Maps, WhatsApp e e-mails corporativos'
      ],
      timeframe: 'Prazo médio de entrega: 7 a 15 dias úteis',
      ctaText: 'Quero um Site Institucional'
    },
    'catalogo': {
      title: 'Catálogo de Produtos Online',
      badge: 'Vitrine aberta 24 horas por dia',
      desc: 'Perfeito para distribuidoras, lojas de móveis, atacados e indústrias que querem exibir seus produtos com especificações detalhadas, fotos em alta definição e botão de orçamento por item.',
      features: [
        'Busca rápida e filtros inteligentes por categoria ou marca',
        'Botão "Cotar este item no WhatsApp" em cada produto',
        'Galeria de imagens leves e ficha técnica detalhada',
        'Facilidade para exportar catálogo ou compartilhar produtos específicos',
        'Painel amigável para inclusão e pausa de estoque'
      ],
      timeframe: 'Prazo médio de entrega: 5 a 10 dias úteis',
      ctaText: 'Quero um Catálogo Online'
    },
    'loja-virtual': {
      title: 'Loja Virtual Completa (E-commerce)',
      badge: 'Novo canal de faturamento seguro',
      desc: 'Venda produtos físicos ou digitais com segurança de nível bancário, integração com meios de pagamento modernos (PIX automático, Cartão com antifraude) e cálculo de frete automático.',
      features: [
        'Checkout transparente e seguro com Mercado Pago, Asaas ou PagBank',
        'Cálculo automático de frete (Correios, Melhor Envio, Jadlog)',
        'Gestão de pedidos, estoque e relatórios financeiros',
        'Proteção ativa contra ataques de injeção e sequestro de sessão',
        'Design fluido tanto no smartphone quanto no computador'
      ],
      timeframe: 'Prazo médio de entrega: 12 a 25 dias úteis',
      ctaText: 'Quero uma Loja Virtual'
    },
    'blog': {
      title: 'Blog Profissional & Portal de Artigos',
      badge: 'Autoridade e atração orgânica no Google',
      desc: 'Canal de publicação de conteúdo para atrair clientes gratuitamente pelos mecanismos de busca, educar seu público-alvo e construir uma base sólida de leitores e potenciais clientes.',
      features: [
        'Otimização on-page técnica para ranqueamento no Google (SEO)',
        'Carregamento ultraveloz para redução da taxa de rejeição',
        'Compartilhamento fácil em redes sociais e captação de leads/newsletter',
        'Painel de escrita amigável com suporte a imagens, vídeos e links',
        'Código limpo e sustentável'
      ],
      timeframe: 'Prazo médio de entrega: 5 a 10 dias úteis',
      ctaText: 'Quero um Blog Profissional'
    },
    'automacao': {
      title: 'Automação de Atendimento & Agentes IA',
      badge: 'Mais tempo livre e respostas em segundos',
      desc: 'Soluções inteligentes com WhatsApp Cloud API, triagem automática de clientes, qualificação de leads, agendamento de consultas e integração com planilhas ou sistemas de CRM.',
      features: [
        'Respostas automáticas para dúvidas frequentes 24 horas por dia',
        'Qualificação de clientes antes de passar para o atendente humano',
        'Disparo de notificações de pedidos, lembretes de agendamento ou cobranças',
        'Integração com Google Planilhas, Notion, Trello ou banco de dados',
        'Segurança no tratamento dos dados do cliente (Criptografia de ponta a ponta)'
      ],
      timeframe: 'Prazo médio de entrega: 5 a 12 dias úteis',
      ctaText: 'Quero Automação de Atendimento'
    }
  };

  const modalBackdrop = document.getElementById('solution-modal');
  const modalCloseBtn = document.getElementById('modal-close');
  const modalTitle = document.getElementById('modal-title');
  const modalBadge = document.getElementById('modal-badge');
  const modalDesc = document.getElementById('modal-desc');
  const modalFeatures = document.getElementById('modal-features');
  const modalTimeframe = document.getElementById('modal-timeframe');
  const modalCta = document.getElementById('modal-cta');

  function openSolutionModal(key) {
    const data = solutionsData[key];
    if (!data || !modalBackdrop) return;

    modalTitle.textContent = data.title;
    modalBadge.textContent = data.badge;
    modalDesc.textContent = data.desc;
    modalTimeframe.textContent = data.timeframe;
    modalCta.textContent = data.ctaText;

    // Build features
    modalFeatures.innerHTML = '';
    data.features.forEach(feat => {
      const li = document.createElement('li');
      li.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 6L9 17l-5-5"/>
        </svg>
        <span>${feat}</span>
      `;
      modalFeatures.appendChild(li);
    });

    // Set CTA action
    const waText = `Olá, STS! Estive analisando a solução de "${data.title}" no site e gostaria de conversar sobre a implementação dela no meu negócio.`;
    modalCta.href = `https://wa.me/${STS_PHONE}?text=${encodeURIComponent(waText)}`;

    modalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeSolutionModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Hook cards
  document.querySelectorAll('[data-solution]').forEach(card => {
    card.addEventListener('click', () => {
      const key = card.getAttribute('data-solution');
      openSolutionModal(key);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeSolutionModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        closeSolutionModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop && modalBackdrop.classList.contains('active')) {
      closeSolutionModal();
    }
  });

  /* ==========================================================================
     7. Interactive Project Budget & Delivery Calculator
     ========================================================================== */
  const calcProjects = {
    'landing': { name: 'Landing Page', basePrice: 690, baseDays: 4 },
    'cardapio': { name: 'Cardápio Digital', basePrice: 550, baseDays: 3 },
    'institucional': { name: 'Site Institucional', basePrice: 1190, baseDays: 8 },
    'loja': { name: 'Loja Virtual / E-commerce', basePrice: 1890, baseDays: 14 },
    'automacao': { name: 'Automação WhatsApp / IA', basePrice: 890, baseDays: 6 },
    'custom': { name: 'Sistema Web Sob Medida', basePrice: 2490, baseDays: 20 }
  };

  let calcState = {
    projectKey: 'landing',
    addons: [],
    speed: 'normal',
    support: 'none'
  };

  const calcProjectOptions = document.querySelectorAll('.calc-opt[data-calc-project]');
  const calcAddonChecks = document.querySelectorAll('.calc-addon-check');
  const calcSpeedRadios = document.querySelectorAll('input[name="calc-speed"]');
  const calcSupportRadios = document.querySelectorAll('input[name="calc-support"]');

  const calcSumType = document.getElementById('calc-sum-type');
  const calcSumAddons = document.getElementById('calc-sum-addons');
  const calcSumSpeed = document.getElementById('calc-sum-speed');
  const calcSumSupport = document.getElementById('calc-sum-support');
  const calcEstimateVal = document.getElementById('calc-estimate-val');
  const calcEstimateTime = document.getElementById('calc-estimate-time');
  const calcSendWa = document.getElementById('calc-send-wa');

  function calculateQuote() {
    const proj = calcProjects[calcState.projectKey] || calcProjects['landing'];
    let price = proj.basePrice;
    let days = proj.baseDays;

    // Addons
    calcState.addons.forEach(addonVal => {
      if (addonVal === 'cms') { price += 280; days += 2; }
      if (addonVal === 'payment') { price += 350; days += 2; }
      if (addonVal === 'chatbot') { price += 420; days += 3; }
      if (addonVal === 'seo') { price += 220; days += 1; }
      if (addonVal === 'sec') { price += 290; days += 2; }
      if (addonVal === 'domain') { price += 180; }
    });

    // Speed
    if (calcState.speed === 'urgent') {
      price = Math.round(price * 1.25);
      days = Math.max(2, Math.round(days * 0.6));
    }

    // Support note
    let supportText = 'Nenhum plano incluso';
    if (calcState.support === 'basico') supportText = 'Básico (+ R$ 90/mês)';
    if (calcState.support === 'inter') supportText = 'Intermediário (+ R$ 180/mês)';
    if (calcState.support === 'premium') supportText = 'Premium (+ R$ 350/mês)';

    // Update UI
    if (calcSumType) calcSumType.textContent = proj.name;
    if (calcSumAddons) calcSumAddons.textContent = calcState.addons.length ? `${calcState.addons.length} recurso(s) extra(s)` : 'Sem extras';
    if (calcSumSpeed) calcSumSpeed.textContent = calcState.speed === 'urgent' ? 'Prioritário / Expresso (-40% tempo)' : 'Prazo normal';
    if (calcSumSupport) calcSumSupport.textContent = supportText;

    if (calcEstimateVal) {
      calcEstimateVal.textContent = `R$ ${price.toLocaleString('pt-BR')}`;
    }
    if (calcEstimateTime) {
      calcEstimateTime.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
        <span>Prazo estimado: ~${days} dias úteis</span>
      `;
    }

    // Build WhatsApp message
    const waBreakdown = 
      `Olá, STS! Simulei meu projeto na calculadora do site:\n` +
      `▪ Tipo: ${proj.name}\n` +
      `▪ Extras selecionados: ${calcState.addons.length ? calcState.addons.join(', ') : 'Nenhum'}\n` +
      `▪ Ritmo: ${calcState.speed === 'urgent' ? 'Expresso' : 'Padrão'}\n` +
      `▪ Suporte pós-entrega: ${supportText}\n` +
      `▪ Estimativa gerada: R$ ${price.toLocaleString('pt-BR')} (~${days} dias úteis)\n\n` +
      `Gostaria de alinhar os detalhes e formalizar a proposta.`;

    if (calcSendWa) {
      calcSendWa.href = `https://wa.me/${STS_PHONE}?text=${encodeURIComponent(waBreakdown)}`;
    }
  }

  // Bind project selection
  calcProjectOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      calcProjectOptions.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      calcState.projectKey = opt.getAttribute('data-calc-project');
      calculateQuote();
    });
  });

  // Bind addons
  calcAddonChecks.forEach(chk => {
    chk.addEventListener('change', () => {
      const val = chk.value;
      if (chk.checked) {
        if (!calcState.addons.includes(val)) calcState.addons.push(val);
      } else {
        calcState.addons = calcState.addons.filter(item => item !== val);
      }
      calculateQuote();
    });
  });

  // Bind speed
  calcSpeedRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.checked) {
        calcState.speed = radio.value;
        calculateQuote();
      }
    });
  });

  // Bind support
  calcSupportRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.checked) {
        calcState.support = radio.value;
        calculateQuote();
      }
    });
  });

  calculateQuote();

  /* ==========================================================================
     8. Cybersecurity Live Interactive Auditor
     ========================================================================== */
  const runAuditBtn = document.getElementById('run-audit-btn');
  const auditStatusText = document.getElementById('audit-status-text');
  const auditItems = document.querySelectorAll('.audit-item');

  if (runAuditBtn) {
    runAuditBtn.addEventListener('click', () => {
      runAuditBtn.disabled = true;
      runAuditBtn.textContent = 'Executando auditoria...';
      if (auditStatusText) auditStatusText.textContent = 'Diagnosticando camadas de segurança...';

      let currentStep = 0;
      auditItems.forEach(item => {
        const badge = item.querySelector('.audit-badge');
        if (badge) {
          badge.textContent = 'Verificando...';
          badge.style.color = '#38bdf8';
          badge.style.borderColor = 'rgba(56, 189, 248, 0.3)';
        }
      });

      const interval = setInterval(() => {
        if (currentStep < auditItems.length) {
          const item = auditItems[currentStep];
          item.classList.add('active-test');
          const badge = item.querySelector('.audit-badge');
          if (badge) {
            badge.textContent = '100% Protegido ✓';
            badge.style.color = '#3ddc97';
            badge.style.borderColor = 'rgba(61, 220, 151, 0.4)';
          }
          currentStep++;
        } else {
          clearInterval(interval);
          runAuditBtn.disabled = false;
          runAuditBtn.textContent = 'Refazer Auditoria Visual';
          if (auditStatusText) auditStatusText.textContent = 'Auditoria concluída: Arquitetura STS 100% Aprovada!';
          showToast('Auditoria simulada concluída! Todos os pilares de segurança validados.');
        }
      }, 350);
    });
  }

  /* ==========================================================================
     9. Interactive Portfolio Tabs & Mockup Showcase
     ========================================================================== */
  const portfolioCases = {
    'food': {
      title: 'Don Corleone Pizzaria Artesanal',
      category: 'Cardápio Digital & Pedidos no WhatsApp',
      desc: 'Eliminação de 100% dos custos com impressão física e economia de 18% em taxas de aplicativos de delivery com envio direto ao WhatsApp da cozinha.',
      metric1Val: '99/100',
      metric1Label: 'PageSpeed Mobile',
      metric2Val: '+42%',
      metric2Label: 'Aumento em vendas diretas',
      screenPreview: `
        <div style="background:var(--navy); color:#fff; padding:16px; border-radius:6px; margin-bottom:12px;">
          <h4 style="margin:0 0 4px; font-size:1rem; color:#fff;">🍕 Don Corleone Menu</h4>
          <span style="font-size:0.75rem; color:#3ddc97;">● Aberto agora · Pedido via WhatsApp</span>
        </div>
        <div style="border:1px solid var(--line); border-radius:6px; padding:12px; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center;">
          <div><b style="font-size:0.9rem;">Pizza Margherita Especial</b><br><small style="color:var(--mut);">Molho rústico, búfala e manjericão fresco</small></div>
          <span style="color:var(--ok); font-weight:700; font-size:0.9rem;">R$ 64,90</span>
        </div>
        <div style="border:1px solid var(--line); border-radius:6px; padding:12px; display:flex; justify-content:space-between; align-items:center;">
          <div><b style="font-size:0.9rem;">Pizza Parma & Rúcula</b><br><small style="color:var(--mut);">Prosciutto di Parma e lascas de parmesão</small></div>
          <span style="color:var(--ok); font-weight:700; font-size:0.9rem;">R$ 78,00</span>
        </div>
      `
    },
    'b2b': {
      title: 'Scalari & Associados Advocacia',
      category: 'Landing Page de Alta Conversão & B2B',
      desc: 'Página ultraveloz de captação de clientes jurídicos, integrada com agendamento direto e conformidade com código de ética da OAB e LGPD.',
      metric1Val: '0.4s',
      metric1Label: 'Tempo de carregamento',
      metric2Val: '14.8%',
      metric2Label: 'Taxa de conversão de cliques',
      screenPreview: `
        <div style="background:var(--navy-card); color:#fff; padding:16px; border-radius:6px; margin-bottom:12px; border-left:4px solid var(--blue);">
          <span style="font-size:0.75rem; color:var(--sky-light); font-weight:700;">ESPECIALISTAS EM DIREITO TRIBUTÁRIO</span>
          <h4 style="margin:4px 0 0; font-size:1.05rem; color:#fff;">Assessoria jurídica preventiva e contenciosa</h4>
        </div>
        <div style="background:var(--bg); border:1px solid var(--line); padding:14px; border-radius:6px; margin-bottom:8px;">
          <small style="color:var(--mut); display:block; margin-bottom:4px;">Atendimento Imediato:</small>
          <div style="display:flex; gap:8px;">
            <input type="text" placeholder="Seu WhatsApp..." style="padding:6px 10px; font-size:0.8rem; border:1px solid var(--line); border-radius:4px; width:70%; background:var(--card);" readonly value="(19) 99833-2688">
            <button class="btn btn-sm" style="padding:6px 12px; font-size:0.8rem; pointer-events:none;">Agendar</button>
          </div>
        </div>
      `
    },
    'saas': {
      title: 'NexFlow Automação Empresarial',
      category: 'Sistema Web & Integração WhatsApp API',
      desc: 'Plataforma para disparo e triagem de atendimento com inteligência artificial, sincronizada com banco de dados em nuvem e painel em tempo real.',
      metric1Val: '100%',
      metric1Label: 'Conformidade de Segurança',
      metric2Val: '24/7',
      metric2Label: 'Operação sem interrupções',
      screenPreview: `
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:12px;">
          <div style="background:var(--blue-subtle); padding:10px; border-radius:6px; border:1px solid var(--blue-border);">
            <small style="color:var(--mut);">Atendimentos Hoje</small>
            <b style="font-size:1.2rem; color:var(--blue); display:block;">1.428</b>
          </div>
          <div style="background:var(--ok-glow); padding:10px; border-radius:6px; border:1px solid rgba(18,163,107,0.3);">
            <small style="color:var(--mut);">Tempo de Resposta</small>
            <b style="font-size:1.2rem; color:var(--ok); display:block;">4 seg</b>
          </div>
        </div>
        <div style="background:var(--card); border:1px solid var(--line); padding:10px; border-radius:6px; font-size:0.85rem;">
          <span style="color:#3ddc97;">● API WhatsApp Cloud:</span> <span style="color:var(--mut);">Conectada e estável</span>
        </div>
      `
    }
  };

  const portfolioTabBtns = document.querySelectorAll('.portfolio-tab-btn');
  const caseTitle = document.getElementById('case-title');
  const caseCategory = document.getElementById('case-category');
  const caseDesc = document.getElementById('case-desc');
  const caseMetric1Val = document.getElementById('case-m1-val');
  const caseMetric1Label = document.getElementById('case-m1-lbl');
  const caseMetric2Val = document.getElementById('case-m2-val');
  const caseMetric2Label = document.getElementById('case-m2-lbl');
  const casePreviewBody = document.getElementById('case-preview-body');

  function renderCase(key) {
    const item = portfolioCases[key];
    if (!item) return;

    if (caseTitle) caseTitle.textContent = item.title;
    if (caseCategory) caseCategory.textContent = item.category;
    if (caseDesc) caseDesc.textContent = item.desc;
    if (caseMetric1Val) caseMetric1Val.textContent = item.metric1Val;
    if (caseMetric1Label) caseMetric1Label.textContent = item.metric1Label;
    if (caseMetric2Val) caseMetric2Val.textContent = item.metric2Val;
    if (caseMetric2Label) caseMetric2Label.textContent = item.metric2Label;
    if (casePreviewBody) casePreviewBody.innerHTML = item.screenPreview;
  }

  portfolioTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      portfolioTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const key = btn.getAttribute('data-case');
      renderCase(key);
    });
  });

  // Render initial case
  renderCase('food');

  /* ==========================================================================
     10. Interactive FAQ Accordion
     ========================================================================== */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close other items
      faqItems.forEach(other => {
        other.classList.remove('open');
        const otherBtn = other.querySelector('.faq-question');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('open');
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ==========================================================================
     11. Contact Form with Phone Mask, Validation & Multiple Submit Modes
     ========================================================================== */
  const contactForm = document.getElementById('contact-form');
  const phoneInput = document.getElementById('form-phone');
  const btnSubmitWa = document.getElementById('btn-submit-wa');
  const btnSubmitEmail = document.getElementById('btn-submit-email');

  // Input phone mask: (99) 99999-9999
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '');
      if (val.length > 11) val = val.slice(0, 11);

      if (val.length > 6) {
        val = `(${val.slice(0, 2)}) ${val.slice(2, 7)}-${val.slice(7)}`;
      } else if (val.length > 2) {
        val = `(${val.slice(0, 2)}) ${val.slice(2)}`;
      } else if (val.length > 0) {
        val = `(${val}`;
      }
      e.target.value = val;
    });
  }

  function validateContactForm() {
    const name = document.getElementById('form-name')?.value.trim();
    const phone = document.getElementById('form-phone')?.value.trim();
    const email = document.getElementById('form-email')?.value.trim();
    const service = document.getElementById('form-service')?.value;
    const msg = document.getElementById('form-msg')?.value.trim();

    if (!name || name.length < 3) {
      showToast('Por favor, informe seu nome completo.', 'error');
      document.getElementById('form-name')?.focus();
      return null;
    }

    if (!phone || phone.replace(/\D/g, '').length < 10) {
      showToast('Informe um número de WhatsApp válido com DDD.', 'error');
      document.getElementById('form-phone')?.focus();
      return null;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('E-mail em formato inválido.', 'error');
      document.getElementById('form-email')?.focus();
      return null;
    }

    return { name, phone, email, service: service || 'Não especificado', msg: msg || 'Gostaria de um orçamento detalhado.' };
  }

  if (btnSubmitWa) {
    btnSubmitWa.addEventListener('click', (e) => {
      e.preventDefault();
      const data = validateContactForm();
      if (!data) return;

      const formattedMsg = 
        `Olá, STS! Vim pelo formulário de contato do site:\n\n` +
        `👤 *Nome:* ${data.name}\n` +
        `📱 *WhatsApp:* ${data.phone}\n` +
        `📧 *E-mail:* ${data.email || 'Não informado'}\n` +
        `🎯 *Serviço de interesse:* ${data.service}\n` +
        `📝 *Detalhes do projeto:* ${data.msg}\n\n` +
        `Aguardo retorno para conversarmos sobre a proposta!`;

      const targetUrl = `https://wa.me/${STS_PHONE}?text=${encodeURIComponent(formattedMsg)}`;
      showToast('Abrindo WhatsApp com sua proposta formatada...');
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    });
  }

  if (btnSubmitEmail) {
    btnSubmitEmail.addEventListener('click', (e) => {
      e.preventDefault();
      const data = validateContactForm();
      if (!data) return;

      // Save lead locally to simulate CRM persistence
      const leads = JSON.parse(localStorage.getItem('sts_captured_leads') || '[]');
      leads.push({ ...data, date: new Date().toISOString() });
      localStorage.setItem('sts_captured_leads', JSON.stringify(leads));

      btnSubmitEmail.disabled = true;
      btnSubmitEmail.textContent = 'Enviando...';

      setTimeout(() => {
        btnSubmitEmail.disabled = false;
        btnSubmitEmail.textContent = 'Solicitar Proposta por E-mail';
        showToast('Proposta solicitada com sucesso! Entraremos em contato em até 24h.');
        contactForm.reset();
      }, 1000);
    });
  }

  /* ==========================================================================
     12. Floating WhatsApp Widget & Popover
     ========================================================================== */
  const waFloatingBtn = document.getElementById('wa-floating-btn');
  const waPopover = document.getElementById('wa-popover');
  const waPopoverClose = document.getElementById('wa-popover-close');
  const waQuickBtns = document.querySelectorAll('.wa-quick-btn');

  if (waFloatingBtn && waPopover) {
    waFloatingBtn.addEventListener('click', () => {
      waPopover.classList.toggle('active');
    });

    if (waPopoverClose) {
      waPopoverClose.addEventListener('click', () => {
        waPopover.classList.remove('active');
      });
    }

    waQuickBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const text = btn.getAttribute('data-msg');
        const url = `https://wa.me/${STS_PHONE}?text=${encodeURIComponent(text)}`;
        waPopover.classList.remove('active');
        window.open(url, '_blank', 'noopener,noreferrer');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (waPopover.classList.contains('active') &&
          !waPopover.contains(e.target) &&
          !waFloatingBtn.contains(e.target)) {
        waPopover.classList.remove('active');
      }
    });
  }

  // Pre-load dynamic support plan buttons
  document.querySelectorAll('[data-plan-btn]').forEach(btn => {
    btn.addEventListener('click', () => {
      const planName = btn.getAttribute('data-plan-btn');
      const text = `Olá, STS! Tenho interesse no Plano de Suporte "${planName}" para manter meu projeto seguro e atualizado.`;
      window.open(`https://wa.me/${STS_PHONE}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
    });
  });

  console.log('STS Scalari Tech System - Aplicação inicializada com sucesso.');
});
