export interface IfpiContent {
    title: string;
    importance: 'pouco' | 'normal' | 'muita';
}

export interface IfpiTopic {
    name: string;
    notebookColor: 'azul' | 'amarelo' | 'vermelho' | 'verde' | 'rosa' | 'preto';
    difficulty: 'facil' | 'medio' | 'dificil';
    editalId: string;
    contents: IfpiContent[];
}

export const ifpiTopicsData: IfpiTopic[] = [

    {
        name: "Legislação e Ética na Administração Pública",
        notebookColor: "amarelo",
        difficulty: "medio",
        editalId: "ifpi",
        contents: [

            { title: "Constituição Federal de 1988: Educação, Cultura e Desporto", importance: "muita" },
            { title: "Constituição Federal de 1988: Ciência e Tecnologia", importance: "muita" },
            { title: "Constituição Federal de 1988: Administração Pública", importance: "muita" },

            { title: "Estatuto da Criança e do Adolescente (Lei nº 8.069/1990)", importance: "muita" },
            { title: "ECA: princípios, direitos fundamentais e proteção", importance: "normal" },
            { title: "ECA: educação, cultura, esporte e lazer", importance: "normal" },
            { title: "ECA: medidas de proteção", importance: "normal" },

            { title: "Regime Jurídico dos Servidores Públicos Federais (Lei nº 8.112/1990)", importance: "muita" },
            { title: "Lei nº 8.112/1990: provimento e vacância", importance: "muita" },
            { title: "Lei nº 8.112/1990: direitos e vantagens", importance: "muita" },
            { title: "Lei nº 8.112/1990: regime disciplinar e responsabilidades", importance: "muita" },
            { title: "Lei nº 8.112/1990: penalidades", importance: "normal" },
            { title: "Lei nº 8.112/1990: processo administrativo disciplinar", importance: "normal" },

            { title: "Código de Ética Profissional do Servidor Público (Decreto nº 1.171/1994)", importance: "muita" },
            { title: "Decreto nº 1.171/1994: princípios e valores éticos", importance: "muita" },
            { title: "Decreto nº 1.171/1994: deveres e vedações do servidor", importance: "muita" },
            { title: "Decreto nº 1.171/1994: Comissão de Ética", importance: "normal" },

            { title: "Lei de Diretrizes e Bases da Educação Nacional (Lei nº 9.394/1996)", importance: "muita" },
            { title: "LDB: princípios e fins da educação nacional", importance: "muita" },
            { title: "LDB: organização da educação nacional", importance: "muita" },
            { title: "LDB: educação básica", importance: "normal" },
            { title: "LDB: educação profissional e tecnológica", importance: "muita" },
            { title: "LDB: educação superior", importance: "normal" },
            { title: "LDB: profissionais da educação", importance: "normal" },

            { title: "Rede Federal de Educação Profissional, Científica e Tecnológica (Lei nº 11.892/2008)", importance: "muita" },
            { title: "Lei nº 11.892/2008: Institutos Federais", importance: "muita" },
            { title: "Institutos Federais: finalidades, características e objetivos", importance: "muita" },
            { title: "Institutos Federais: organização e estrutura", importance: "normal" },

            { title: "Processo Administrativo Federal (Lei nº 9.784/1999)", importance: "muita" },
            { title: "Lei nº 9.784/1999: princípios e direitos dos administrados", importance: "muita" },
            { title: "Lei nº 9.784/1999: competência e interessados", importance: "normal" },
            { title: "Lei nº 9.784/1999: instrução e decisão", importance: "normal" },
            { title: "Lei nº 9.784/1999: motivação dos atos administrativos", importance: "muita" },
            { title: "Lei nº 9.784/1999: anulação, revogação e convalidação", importance: "muita" },
            { title: "Lei nº 9.784/1999: recursos e prazos administrativos", importance: "normal" },

            { title: "Plano de Carreira dos Cargos Técnico-Administrativos em Educação (Lei nº 11.091/2005)", importance: "muita" },
            { title: "Lei nº 11.091/2005: estrutura e organização da carreira", importance: "muita" },
            { title: "Lei nº 11.091/2005: níveis de classificação e capacitação", importance: "normal" },
            { title: "Lei nº 11.091/2005: desenvolvimento e progressão na carreira", importance: "muita" },
            { title: "Lei nº 11.091/2005: incentivo à qualificação", importance: "normal" },

            { title: "ECA Digital (Lei nº 15.211/2025)", importance: "muita" },
            { title: "ECA Digital: proteção de crianças e adolescentes no ambiente digital", importance: "muita" },
            { title: "ECA Digital: direitos de crianças e adolescentes no ambiente digital", importance: "normal" },
            { title: "ECA Digital: deveres e responsabilidades dos fornecedores digitais", importance: "normal" },

            { title: "Organização Didática do IFPI (Resolução Normativa nº 253/2025)", importance: "muita" },
            { title: "Organização Didática do IFPI: organização dos cursos", importance: "muita" },
            { title: "Organização Didática do IFPI: processos e procedimentos acadêmicos", importance: "normal" },
            { title: "Organização Didática do IFPI: avaliação da aprendizagem", importance: "muita" },
            { title: "Organização Didática do IFPI: frequência e aproveitamento acadêmico", importance: "normal" }
        ]
    },

    {
        name: "Língua Portuguesa",
        notebookColor: "azul",
        difficulty: "medio",
        editalId: "ifpi",
        contents: [

            { title: "Leitura e compreensão de textos", importance: "muita" },
            { title: "Interpretação de textos", importance: "muita" },
            { title: "Textos verbais, não verbais e multimodais", importance: "muita" },
            { title: "Informações explícitas e implícitas e inferência", importance: "muita" },

            { title: "Gêneros textuais", importance: "muita" },
            { title: "Tipologias textuais", importance: "muita" },
            { title: "Narração, descrição e dissertação", importance: "normal" },
            { title: "Argumentação, exposição e injunção", importance: "normal" },

            { title: "Figuras de linguagem", importance: "muita" },
            { title: "Figuras de palavra, pensamento, construção e som", importance: "normal" },
            { title: "Figuras de linguagem e efeitos de sentido", importance: "muita" },

            { title: "Coesão textual", importance: "muita" },
            { title: "Coerência textual", importance: "muita" },
            { title: "Mecanismos de coesão e referenciação", importance: "normal" },
            { title: "Conectivos e relações de sentido", importance: "normal" },

            { title: "Norma-padrão da língua portuguesa", importance: "muita" },
            { title: "Variação linguística", importance: "normal" },
            { title: "Variedades e adequação linguística", importance: "normal" },

            { title: "Ortografia oficial", importance: "muita" },
            { title: "Novo Acordo Ortográfico", importance: "muita" },
            { title: "Acentuação gráfica", importance: "muita" },

            { title: "Uso do sinal indicativo de crase", importance: "muita" },
            { title: "Regras e casos de ocorrência da crase", importance: "muita" },
            { title: "Casos facultativos e casos em que não ocorre crase", importance: "normal" },

            { title: "Classes de palavras", importance: "muita" },
            { title: "Substantivo, adjetivo e artigo", importance: "normal" },
            { title: "Numeral e pronome", importance: "normal" },
            { title: "Verbo e advérbio", importance: "normal" },
            { title: "Preposição, conjunção e interjeição", importance: "normal" },
            { title: "Flexão nominal", importance: "normal" },
            { title: "Flexão verbal", importance: "normal" },
            { title: "Processos de formação de palavras", importance: "normal" },

            { title: "Termos da oração", importance: "muita" },
            { title: "Sintaxe do período simples", importance: "muita" },
            { title: "Sintaxe do período composto", importance: "muita" },
            { title: "Coordenação e orações coordenadas", importance: "muita" },
            { title: "Subordinação e orações subordinadas", importance: "muita" },
            { title: "Concordância verbal", importance: "muita" },
            { title: "Concordância nominal", importance: "muita" },
            { title: "Regência verbal", importance: "muita" },
            { title: "Regência nominal", importance: "normal" },
            { title: "Colocação pronominal", importance: "muita" },

            { title: "Sinais de pontuação", importance: "muita" },
            { title: "Vírgula e demais sinais de pontuação", importance: "muita" },
            { title: "Pontuação e efeitos de sentido", importance: "normal" },

            { title: "Sinonímia e antonímia", importance: "normal" },
            { title: "Homonímia e paronímia", importance: "normal" },
            { title: "Polissemia e ambiguidade", importance: "muita" },
            { title: "Conotação e denotação", importance: "muita" },
            { title: "Efeitos de sentido e relações semânticas", importance: "normal" }
        ]
    },

    {
        name: "Engenharia e Arquitetura de Software",
        notebookColor: "vermelho",
        difficulty: "dificil",
        editalId: "ifpi",
        contents: [

            { title: "Ciclo de vida de software", importance: "muita" },
            { title: "Metodologias tradicionais", importance: "muita" },
            { title: "Modelo Cascata", importance: "normal" },
            { title: "RUP", importance: "normal" },
            { title: "Metodologias ágeis", importance: "muita" },
            { title: "Scrum", importance: "muita" },
            { title: "Extreme Programming (XP)", importance: "normal" },
            { title: "Kanban", importance: "normal" },
            { title: "TDD e DDD", importance: "muita" },

            { title: "Engenharia de requisitos", importance: "muita" },
            { title: "Elicitação e análise de requisitos", importance: "muita" },
            { title: "Especificação e validação de requisitos", importance: "normal" },

            { title: "UML 2.5.1", importance: "muita" },
            { title: "Diagramas UML", importance: "muita" },
            { title: "BPMN 2.0", importance: "muita" },
            { title: "Modelagem de processos com BPMN", importance: "normal" },

            { title: "Arquitetura em camadas", importance: "muita" },
            { title: "MVC", importance: "muita" },
            { title: "Microsserviços", importance: "muita" },
            { title: "Arquitetura hexagonal", importance: "normal" },
            { title: "Arquitetura orientada a eventos", importance: "normal" },
            { title: "Serverless", importance: "normal" },

            { title: "Padrões de projeto GoF", importance: "muita" },
            { title: "Padrões de projeto GRASP", importance: "normal" },

            { title: "APIs REST", importance: "muita" },
            { title: "SOAP", importance: "normal" },
            { title: "e-PING", importance: "normal" },

            { title: "Qualidade de software", importance: "muita" },
            { title: "CMMI V3.0", importance: "normal" },
            { title: "MPS.BR", importance: "normal" },
            { title: "ISO 12207", importance: "normal" },
            { title: "ISO 25010 e ISO 25040", importance: "muita" },
            { title: "ISO 29119", importance: "normal" },

            { title: "Testes unitários", importance: "muita" },
            { title: "Testes de integração", importance: "muita" },
            { title: "Testes funcionais e não funcionais", importance: "muita" },
            { title: "Gerência de configuração", importance: "normal" }
        ]
    },

    {
        name: "Desenvolvimento de Sistemas e Aplicações Web",
        notebookColor: "vermelho",
        difficulty: "dificil",
        editalId: "ifpi",
        contents: [

            { title: "Lógica de programação", importance: "muita" },
            { title: "Estruturas de dados", importance: "muita" },
            { title: "Programação Orientada a Objetos", importance: "muita" },

            { title: "Python", importance: "muita" },
            { title: "PHP", importance: "normal" },
            { title: "Java", importance: "muita" },
            { title: "Django", importance: "normal" },
            { title: "Flask", importance: "normal" },
            { title: "Laravel", importance: "normal" },
            { title: "JSF", importance: "pouco" },

            { title: "HTML5", importance: "muita" },
            { title: "CSS3", importance: "muita" },
            { title: "JavaScript", importance: "muita" },
            { title: "jQuery", importance: "normal" },

            { title: "HTTP e HTTPS", importance: "muita" },
            { title: "REST", importance: "muita" },
            { title: "JSON", importance: "muita" },
            { title: "XML", importance: "normal" },
            { title: "XSLT", importance: "pouco" },

            { title: "Git", importance: "muita" },
            { title: "GitLab", importance: "normal" },
            { title: "Docker", importance: "muita" },
            { title: "Kubernetes", importance: "muita" },
            { title: "Pipelines CI/CD", importance: "muita" },
            { title: "Selenium e automação de testes", importance: "normal" },

            { title: "Conceitos de desenvolvimento para dispositivos móveis", importance: "normal" }
        ]
    },

    {
        name: "Banco de Dados e Inteligência de Dados",
        notebookColor: "vermelho",
        difficulty: "dificil",
        editalId: "ifpi",
        contents: [

            { title: "Conceitos de bancos de dados", importance: "muita" },
            { title: "Modelagem conceitual", importance: "muita" },
            { title: "Modelagem lógica e física", importance: "muita" },
            { title: "Modelo Entidade-Relacionamento (MER/DER)", importance: "muita" },
            { title: "Normalização", importance: "muita" },

            { title: "SQL ANSI", importance: "muita" },
            { title: "PL/SQL", importance: "normal" },
            { title: "PL/pgSQL", importance: "normal" },
            { title: "T-SQL", importance: "normal" },
            { title: "Views", importance: "muita" },
            { title: "Triggers", importance: "muita" },
            { title: "Procedimentos armazenados", importance: "muita" },

            { title: "PostgreSQL 16.x", importance: "muita" },
            { title: "MySQL 8", importance: "muita" },
            { title: "SQL Server", importance: "muita" },
            { title: "Arquitetura de SGBDs", importance: "normal" },
            { title: "Transações e propriedades ACID", importance: "muita" },
            { title: "Controle de concorrência", importance: "muita" },
            { title: "Gerenciamento de memória em SGBDs", importance: "normal" },

            { title: "Tuning de bancos de dados", importance: "normal" },
            { title: "Indexação", importance: "muita" },
            { title: "Backup e restore", importance: "muita" },
            { title: "Replicação", importance: "normal" },

            { title: "Business Intelligence (BI)", importance: "muita" },
            { title: "Data Warehouse", importance: "muita" },
            { title: "Data Lake", importance: "normal" },
            { title: "OLAP", importance: "normal" },
            { title: "Data Mining", importance: "normal" },
            { title: "ETL", importance: "muita" }
        ]
    },

    {
        name: "Gestão e Governança de TI",
        notebookColor: "azul",
        difficulty: "medio",
        editalId: "ifpi",
        contents: [

            { title: "Governança de Tecnologia da Informação", importance: "muita" },
            { title: "COBIT 2019", importance: "muita" },

            { title: "Gerenciamento de Serviços de TI", importance: "muita" },
            { title: "ITIL 4", importance: "muita" },

            { title: "Gerenciamento de Projetos", importance: "muita" },
            { title: "PMBOK 7ª Edição", importance: "muita" },
            { title: "Conceitos fundamentais de gerenciamento de projetos", importance: "normal" },

            { title: "Gestão de riscos corporativos", importance: "muita" },
            { title: "Gestão de riscos de TI", importance: "muita" },

            { title: "Gestão de Processos de Negócio (BPM)", importance: "muita" },
            { title: "CBOK", importance: "normal" }
        ]
    },

    {
        name: "Arquitetura e Organização de Computadores",
        notebookColor: "preto",
        difficulty: "medio",
        editalId: "ifpi",
        contents: [

            { title: "Sistemas de numeração", importance: "muita" },
            { title: "Aritmética computacional", importance: "muita" },
            { title: "Álgebra booleana", importance: "muita" },

            { title: "Arquitetura de Von Neumann", importance: "muita" },
            { title: "Componentes de hardware", importance: "muita" },
            { title: "Barramentos", importance: "normal" },
            { title: "Ciclo de instrução", importance: "muita" },

            { title: "Hierarquia de memória", importance: "muita" },
            { title: "Registradores", importance: "normal" },
            { title: "Memória cache (L1, L2 e L3)", importance: "muita" },
            { title: "Memória RAM", importance: "muita" },
            { title: "Memória secundária", importance: "muita" },

            { title: "Sistemas de entrada e saída (E/S)", importance: "normal" },
            { title: "Interrupções", importance: "muita" },
            { title: "DMA", importance: "muita" },

            { title: "Arquitetura RISC", importance: "normal" },
            { title: "Arquitetura CISC", importance: "normal" },
            { title: "Pipelining", importance: "muita" },
            { title: "Multiprocessamento", importance: "normal" }
        ]
    },

    {
        name: "Sistemas Operacionais, Virtualização e Nuvem",
        notebookColor: "preto",
        difficulty: "dificil",
        editalId: "ifpi",
        contents: [

            { title: "Conceitos de sistemas operacionais", importance: "muita" },
            { title: "Gerência de processos", importance: "muita" },
            { title: "Gerência de memória", importance: "muita" },
            { title: "Gerência de entrada e saída", importance: "normal" },
            { title: "Sistemas de arquivos", importance: "muita" },

            { title: "Administração de sistemas Windows", importance: "muita" },
            { title: "Administração de sistemas Linux", importance: "muita" },
            { title: "Comandos Linux", importance: "muita" },
            { title: "Bash e Shell Script", importance: "muita" },
            { title: "PowerShell e scripts", importance: "muita" },

            { title: "Conceitos de virtualização", importance: "muita" },
            { title: "Hypervisors", importance: "muita" },
            { title: "VirtualBox", importance: "normal" },
            { title: "Hyper-V", importance: "normal" },
            { title: "VMware", importance: "normal" },

            { title: "Sistemas distribuídos", importance: "muita" },
            { title: "Clusters", importance: "normal" },
            { title: "Computação em grade", importance: "pouco" },

            { title: "Computação em Nuvem", importance: "muita" },
            { title: "IaaS, PaaS e SaaS", importance: "muita" },
            { title: "AWS", importance: "muita" },
            { title: "Oracle Cloud", importance: "normal" },
            { title: "Microsoft Azure", importance: "muita" }
        ]
    },

    {
        name: "Redes de Computadores e Serviços de Infraestrutura",
        notebookColor: "verde",
        difficulty: "dificil",
        editalId: "ifpi",
        contents: [

            { title: "Modelo OSI", importance: "muita" },
            { title: "Modelo TCP/IP", importance: "muita" },
            { title: "Topologias de rede", importance: "normal" },
            { title: "Tipos de redes", importance: "normal" },
            { title: "Tecnologias WAN", importance: "normal" },

            { title: "Camada Física", importance: "muita" },
            { title: "Camada de Enlace", importance: "muita" },
            { title: "Ethernet (IEEE 802.3)", importance: "muita" },
            { title: "Wi-Fi (IEEE 802.11)", importance: "muita" },
            { title: "Equipamentos de rede", importance: "muita" },
            { title: "VLANs", importance: "muita" },

            { title: "IPv4", importance: "muita" },
            { title: "IPv6", importance: "muita" },
            { title: "Sub-redes", importance: "muita" },
            { title: "Roteamento", importance: "muita" },
            { title: "QoS", importance: "normal" },

            { title: "DNS", importance: "muita" },
            { title: "HTTP e HTTPS", importance: "muita" },
            { title: "FTP", importance: "normal" },
            { title: "SMTP", importance: "normal" },

            { title: "RDP", importance: "normal" },
            { title: "SSH", importance: "muita" },
            { title: "SMB", importance: "normal" },
            { title: "NFS", importance: "normal" },

            { title: "Servidores Web: Apache, Nginx, Tomcat, GlassFish e IIS", importance: "muita" },
            { title: "VoIP", importance: "normal" },
            { title: "Issabel e FreePBX", importance: "pouco" },

            { title: "LDAP", importance: "muita" },
            { title: "Active Directory", importance: "muita" },
            { title: "FreeRADIUS", importance: "normal" },
            { title: "Samba", importance: "normal" },

            { title: "VPNs", importance: "muita" },
            { title: "OpenVPN e IPsec", importance: "muita" },
            { title: "SNMP", importance: "muita" },
            { title: "MIB e agentes SNMP", importance: "normal" },

            { title: "Gestão de ativos de TI", importance: "normal" },
            { title: "OCS, NetBox e GLPI", importance: "normal" }
        ]
    },

    {
        name: "Segurança da Informação, Monitoramento e Disponibilidade",
        notebookColor: "vermelho",
        difficulty: "dificil",
        editalId: "ifpi",
        contents: [

            { title: "Criptografia simétrica e assimétrica", importance: "muita" },
            { title: "Funções hash", importance: "muita" },
            { title: "Assinatura digital", importance: "muita" },
            { title: "Certificação digital", importance: "muita" },
            { title: "ICP-Brasil", importance: "muita" },

            { title: "Firewalls", importance: "muita" },
            { title: "IDS e IPS", importance: "muita" },
            { title: "WAF", importance: "muita" },
            { title: "Proxies", importance: "normal" },
            { title: "NAT", importance: "normal" },

            { title: "Malwares", importance: "muita" },
            { title: "Spoofing", importance: "muita" },
            { title: "Flood", importance: "normal" },
            { title: "DoS e DDoS", importance: "muita" },
            { title: "Phishing", importance: "muita" },
            { title: "Sniffing", importance: "normal" },

            { title: "Monitoramento de infraestrutura", importance: "muita" },
            { title: "SOC e NOC", importance: "muita" },
            { title: "Zabbix", importance: "muita" },
            { title: "Prometheus", importance: "normal" },
            { title: "Grafana", importance: "normal" },

            { title: "Análise de logs", importance: "muita" },
            { title: "Auditoria Windows e Linux", importance: "muita" },
            { title: "NXLog e Logstash", importance: "normal" },
            { title: "Graylog", importance: "normal" },
            { title: "Wazuh", importance: "muita" },
            { title: "ElasticStack: Elasticsearch e Kibana", importance: "muita" },
            { title: "SIEM", importance: "muita" },

            { title: "Alta disponibilidade (HA)", importance: "muita" },
            { title: "MTBF, MTTR e MTTF", importance: "muita" },
            { title: "Métricas de resiliência", importance: "normal" }
        ]
    },

    {
        name: "Governança de Segurança, Riscos e Privacidade",
        notebookColor: "amarelo",
        difficulty: "dificil",
        editalId: "ifpi",
        contents: [

            { title: "Gestão de Segurança da Informação", importance: "muita" },
            { title: "ISO/IEC 27001", importance: "muita" },
            { title: "ISO/IEC 27002", importance: "muita" },

            { title: "Gestão de riscos de segurança da informação", importance: "muita" },
            { title: "ISO/IEC 27005", importance: "muita" },

            { title: "Privacidade e proteção de dados", importance: "muita" },
            { title: "ISO/IEC 27701", importance: "normal" },
            { title: "LGPD (Lei nº 13.709/2018)", importance: "muita" },
            { title: "LGPD: princípios e fundamentos", importance: "muita" },
            { title: "LGPD: dados pessoais e dados pessoais sensíveis", importance: "muita" },
            { title: "LGPD: tratamento de dados pessoais", importance: "muita" },
            { title: "LGPD: direitos dos titulares", importance: "muita" },
            { title: "LGPD: agentes de tratamento", importance: "normal" }
        ]
    },

    {
        name: "Data Center, Armazenamento e Continuidade",
        notebookColor: "verde",
        difficulty: "dificil",
        editalId: "ifpi",
        contents: [

            { title: "Infraestrutura física de Data Center", importance: "muita" },
            { title: "Classificação Tier de Data Centers", importance: "muita" },
            { title: "UPS e No-breaks", importance: "muita" },
            { title: "Geradores", importance: "normal" },
            { title: "Climatização", importance: "normal" },

            { title: "Discos SATA, SAS e NVMe", importance: "muita" },
            { title: "RAID", importance: "muita" },
            { title: "DAS, NAS e SAN", importance: "muita" },
            { title: "iSCSI", importance: "normal" },
            { title: "Fibre Channel", importance: "normal" },

            { title: "Virtualização avançada", importance: "muita" },
            { title: "Proxmox VE", importance: "muita" },
            { title: "Hyper-V", importance: "normal" },
            { title: "VMware vSphere", importance: "muita" },
            { title: "XenServer", importance: "normal" },
            { title: "Hyper-Converged Infrastructure (HCI)", importance: "muita" },

            { title: "Alta disponibilidade em infraestrutura", importance: "muita" },
            { title: "Balanceamento de carga L4 e L7", importance: "muita" },
            { title: "Clusters e failover", importance: "muita" },
            { title: "Replicação", importance: "muita" },

            { title: "Políticas de backup", importance: "muita" },
            { title: "Mídias e retenção de backup", importance: "normal" },
            { title: "Restore", importance: "muita" },
            { title: "Continuidade de negócios", importance: "muita" },
            { title: "Plano de Recuperação de Desastres (DRP)", importance: "muita" }
        ]
    }

];
