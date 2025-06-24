-- DROP SCHEMA dbo;

CREATE SCHEMA dbo;
-- pibicdb.dbo.ABO_AvaliacaoBolsistaOrientador_AUD definição

-- Drop table

-- DROP TABLE pibicdb.dbo.ABO_AvaliacaoBolsistaOrientador_AUD;

CREATE TABLE pibicdb.dbo.ABO_AvaliacaoBolsistaOrientador_AUD (
	AGB_Codigo_AUD int IDENTITY(1,1) NOT NULL,
	ABO_codigo int NOT NULL,
	ABO_codigo_IVP int NOT NULL,
	ABO_codigo_RPT int NOT NULL,
	ABO_nota int NOT NULL,
	ABO_tipo varchar(25) COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL,
	ABO_dt_exclusao datetime NOT NULL,
	ABO_usuario varchar(11) COLLATE SQL_Latin1_General_CP1_CI_AI NULL
);


-- pibicdb.dbo.AGB_AgenciaFinanciadoraPEP_AUD definição

-- Drop table

-- DROP TABLE pibicdb.dbo.AGB_AgenciaFinanciadoraPEP_AUD;

CREATE TABLE pibicdb.dbo.AGB_AgenciaFinanciadoraPEP_AUD (
	AGB_Codigo_AUD int IDENTITY(1,1) NOT NULL,
	AGB_Codigo int NOT NULL,
	AGB_Codigo_PEP int NOT NULL,
	AGB_Codigo_AGE int NOT NULL,
	AGB_BolsasOferecidas int NOT NULL,
	AGB_BolsasUtilizadas int NULL,
	AGB_descricao char(80) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	AGB_tipo varchar(25) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	AGB_dt_exclusao datetime NULL,
	AGB_usuario varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AI NULL
);


-- pibicdb.dbo.AGE_AgenciaFinanciadora_AUD definição

-- Drop table

-- DROP TABLE pibicdb.dbo.AGE_AgenciaFinanciadora_AUD;

CREATE TABLE pibicdb.dbo.AGE_AgenciaFinanciadora_AUD (
	AGE_Codigo_AUD int IDENTITY(1,1) NOT NULL,
	AGE_Codigo int NOT NULL,
	AGE_Descricao varchar(150) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	AGE_Sigla varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	AGE_User varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL,
	AGE_Ch_Ativo int NOT NULL,
	AGE_tipo varchar(25) COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL,
	AGE_dt_exclusao datetime NOT NULL,
	AGE_usuario varchar(11) COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL,
	CONSTRAINT PK_AGE_AgenciaFinanciadora_AUD PRIMARY KEY (AGE_Codigo_AUD)
);


-- pibicdb.dbo.AGE_AgenciaFinanciadora_user definição

-- Drop table

-- DROP TABLE pibicdb.dbo.AGE_AgenciaFinanciadora_user;

CREATE TABLE pibicdb.dbo.AGE_AgenciaFinanciadora_user (
	AGE_Codigo int IDENTITY(1,1) NOT NULL,
	AGE_Descricao varchar(150) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	AGE_Sigla varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	AGE_User varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AI DEFAULT suser_sname() NOT NULL,
	AGE_Ch_Ativo int DEFAULT 1 NOT NULL,
	AGE_usuario varchar(11) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	CONSTRAINT PK_AGE_AgenciaFinanciadora PRIMARY KEY (AGE_Codigo)
);


-- pibicdb.dbo.AOB_AvaliacaoOrientadorBolsista_AUD definição

-- Drop table

-- DROP TABLE pibicdb.dbo.AOB_AvaliacaoOrientadorBolsista_AUD;

CREATE TABLE pibicdb.dbo.AOB_AvaliacaoOrientadorBolsista_AUD (
	AOB_codigo_AUD int IDENTITY(1,1) NOT NULL,
	AOB_codigo int NOT NULL,
	AOB_codigo_IAP int NOT NULL,
	AOB_codigo_RPT int NOT NULL,
	AOB_nota int NOT NULL,
	AOB_tipo varchar(25) COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL,
	AOB_dt_exclusao datetime NOT NULL,
	AOB_usuario varchar(11) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	CONSTRAINT PK_AOB_AvaliacaoOrientadorBolsista_AUD PRIMARY KEY (AOB_codigo_AUD)
);


-- pibicdb.dbo.APO_Apoio definição

-- Drop table

-- DROP TABLE pibicdb.dbo.APO_Apoio;

CREATE TABLE pibicdb.dbo.APO_Apoio (
	APO_codigo int IDENTITY(1,1) NOT NULL,
	APO_descricao varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	CONSTRAINT PK_APO_Apoio PRIMARY KEY (APO_codigo)
);


-- pibicdb.dbo.ARE_Area_user definição

-- Drop table

-- DROP TABLE pibicdb.dbo.ARE_Area_user;

CREATE TABLE pibicdb.dbo.ARE_Area_user (
	ARE_codigo int IDENTITY(1,1) NOT NULL,
	ARE_ref varchar(10) COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL,
	ARE_descricao varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL,
	ARE_user varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AI DEFAULT suser_sname() NOT NULL,
	ARE_ch_ativo char(1) COLLATE SQL_Latin1_General_CP1_CI_AI DEFAULT 'S' NOT NULL,
	CONSTRAINT PK_ARE_Area PRIMARY KEY (ARE_codigo)
);


-- pibicdb.dbo.BEO_BolsaExternaOrigem definição

-- Drop table

-- DROP TABLE pibicdb.dbo.BEO_BolsaExternaOrigem;

CREATE TABLE pibicdb.dbo.BEO_BolsaExternaOrigem (
	BEO_codigo varchar(1) COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL,
	BEO_descricao nvarchar(50) COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL,
	CONSTRAINT PK_BET_BolsaExternaTipo PRIMARY KEY (BEO_codigo)
);


-- pibicdb.dbo.BOL_Bolsista_AUD definição

-- Drop table

-- DROP TABLE pibicdb.dbo.BOL_Bolsista_AUD;

CREATE TABLE pibicdb.dbo.BOL_Bolsista_AUD (
	BOL_codigo_AUD int IDENTITY(1,1) NOT NULL,
	BOL_codigo int NOT NULL,
	BOL_cpfAluno varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	BOL_codigo_PTR int NULL,
	BOL_codigo_AGE int NULL,
	BOL_agenciaBB varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	BOL_contaBB varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	BOL_dataInicio datetime NULL,
	BOL_dataFim datetime NULL,
	BOL_codigo_STB int NULL,
	BOL_nmProcCNPq varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	BOL_codigo_BEO varchar(1) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	BOL_tipo varchar(1) COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL,
	BOL_dt_exclusao datetime NOT NULL,
	BOL_usuario varchar(11) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	CONSTRAINT PK_BOL_Bolsista_AUD PRIMARY KEY (BOL_codigo_AUD)
);


-- pibicdb.dbo.BPR_BolsaProdutividade definição

-- Drop table

-- DROP TABLE pibicdb.dbo.BPR_BolsaProdutividade;

CREATE TABLE pibicdb.dbo.BPR_BolsaProdutividade (
	BPR_codigo int NOT NULL,
	BPR_descricao varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	CONSTRAINT PK_BPR_BolsaProdutividade PRIMARY KEY (BPR_codigo)
);


-- pibicdb.dbo.COM_Comite_AUD definição

-- Drop table

-- DROP TABLE pibicdb.dbo.COM_Comite_AUD;

CREATE TABLE pibicdb.dbo.COM_Comite_AUD (
	COM_codigo_AUD int IDENTITY(1,1) NOT NULL,
	COM_codigo int NOT NULL,
	COM_codigo_SAR int NULL,
	COM_bolsaProdutividade int NULL,
	COM_cpfComite varchar(11) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	COM_tipo varchar(25) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	COM_data datetime NULL,
	COM_usuario varchar(11) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	CONSTRAINT PK_COM_Comite_AUD PRIMARY KEY (COM_codigo_AUD)
);


-- pibicdb.dbo.CRR_CriterioAvaliacaoRelatorio definição

-- Drop table

-- DROP TABLE pibicdb.dbo.CRR_CriterioAvaliacaoRelatorio;

CREATE TABLE pibicdb.dbo.CRR_CriterioAvaliacaoRelatorio (
	CRR_codigo int IDENTITY(1,1) NOT NULL,
	CRR_descricao varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	CONSTRAINT PK_CRR_CriterioAvaliacaoRelatorio PRIMARY KEY (CRR_codigo)
);


-- pibicdb.dbo.CTR_CategoriaAvaliacaoRelatorio definição

-- Drop table

-- DROP TABLE pibicdb.dbo.CTR_CategoriaAvaliacaoRelatorio;

CREATE TABLE pibicdb.dbo.CTR_CategoriaAvaliacaoRelatorio (
	CTR_codigo int IDENTITY(1,1) NOT NULL,
	CTR_descricao varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	CTR_ordem int NULL,
	CONSTRAINT PK_CTR_CategoriaAvaliacaoRelatorio PRIMARY KEY (CTR_codigo)
);


-- pibicdb.dbo.EDF_EditalFormulario_user definição

-- Drop table

-- DROP TABLE pibicdb.dbo.EDF_EditalFormulario_user;

CREATE TABLE pibicdb.dbo.EDF_EditalFormulario_user (
	EDF_codigo int IDENTITY(1,1) NOT NULL,
	EDF_nomeArquivo varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	EDF_nomeExibicao varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	EDF_extensao varchar(25) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	EDF_tipo varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	EDF_usuario varchar(25) COLLATE SQL_Latin1_General_CP1_CI_AI DEFAULT suser_sname() NULL,
	EDF_visivel char(1) COLLATE SQL_Latin1_General_CP1_CI_AI DEFAULT 'S' NULL,
	EDF_dataAtualizacao datetime DEFAULT getdate() NULL,
	CONSTRAINT pk_editalFormulario PRIMARY KEY (EDF_codigo)
);


-- pibicdb.dbo.EVA_EventoAtividadePEP_AUD definição

-- Drop table

-- DROP TABLE pibicdb.dbo.EVA_EventoAtividadePEP_AUD;

CREATE TABLE pibicdb.dbo.EVA_EventoAtividadePEP_AUD (
	EVA_Codigo_AUD int IDENTITY(1,1) NOT NULL,
	EVA_Codigo int NOT NULL,
	EVA_Codigo_PEP int NULL,
	EVA_Codigo_EVE int NULL,
	EVA_Codigo_ATI int NULL,
	EVA_Codigo_GRI int NULL,
	EVA_DtInicio datetime NULL,
	EVA_DtFim datetime NULL,
	EVA_DtFimProrrogação varchar(25) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	EVA_tipo varchar(25) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	EVA_dt_exclusao varchar(25) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	EVA_usuario varchar(25) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	CONSTRAINT PK_EVA_EventoAtividadePEP_AUD PRIMARY KEY (EVA_Codigo_AUD)
);


-- pibicdb.dbo.EVE_Evento definição

-- Drop table

-- DROP TABLE pibicdb.dbo.EVE_Evento;

CREATE TABLE pibicdb.dbo.EVE_Evento (
	EVE_Codigo int IDENTITY(1,1) NOT NULL,
	EVE_Descricao varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	CONSTRAINT PK_EVE_Evento PRIMARY KEY (EVE_Codigo)
);


-- pibicdb.dbo.GRI_GrupoInformacao definição

-- Drop table

-- DROP TABLE pibicdb.dbo.GRI_GrupoInformacao;

CREATE TABLE pibicdb.dbo.GRI_GrupoInformacao (
	GRI_GrupoInformacao int IDENTITY(1,1) NOT NULL,
	GRI_Descricao varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL,
	CONSTRAINT PK_GRI_GrupoInformacao PRIMARY KEY (GRI_GrupoInformacao)
);


-- pibicdb.dbo.IAB_ItemAvaliacaoBolsista definição

-- Drop table

-- DROP TABLE pibicdb.dbo.IAB_ItemAvaliacaoBolsista;

CREATE TABLE pibicdb.dbo.IAB_ItemAvaliacaoBolsista (
	IAB_codigo int IDENTITY(1,1) NOT NULL,
	IAB_descricao varchar(200) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	CONSTRAINT PK_IAB_ItemAvaliacaoBolsista PRIMARY KEY (IAB_codigo)
);


-- pibicdb.dbo.IAO_ItemAvaliacaoOrientador definição

-- Drop table

-- DROP TABLE pibicdb.dbo.IAO_ItemAvaliacaoOrientador;

CREATE TABLE pibicdb.dbo.IAO_ItemAvaliacaoOrientador (
	IAO_codigo int IDENTITY(1,1) NOT NULL,
	IAO_descricao varchar(200) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	CONSTRAINT PK_IAO_ItemAvaliacaoOrientador PRIMARY KEY (IAO_codigo)
);


-- pibicdb.dbo.IAR_ItemAvaliacaoRelatorio definição

-- Drop table

-- DROP TABLE pibicdb.dbo.IAR_ItemAvaliacaoRelatorio;

CREATE TABLE pibicdb.dbo.IAR_ItemAvaliacaoRelatorio (
	IAR_codigo int IDENTITY(1,1) NOT NULL,
	IAR_descricao varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	CONSTRAINT PK_IAR_ItemAvaliacaoRelatorio PRIMARY KEY (IAR_codigo)
);


-- pibicdb.dbo.IDI_Idioma definição

-- Drop table

-- DROP TABLE pibicdb.dbo.IDI_Idioma;

CREATE TABLE pibicdb.dbo.IDI_Idioma (
	IDI_Codigo int IDENTITY(1,1) NOT NULL,
	IDI_Descricao varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL,
	CONSTRAINT pk_idioma PRIMARY KEY (IDI_Codigo)
);


-- pibicdb.dbo.IND_Inadimplencia_user definição

-- Drop table

-- DROP TABLE pibicdb.dbo.IND_Inadimplencia_user;

CREATE TABLE pibicdb.dbo.IND_Inadimplencia_user (
	IND_codigo_EVA int NOT NULL,
	IND_data_liberacao datetime NULL,
	IND_data_insercao datetime NOT NULL,
	IND_cpf_inadimplente varchar(11) COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL,
	IND_cpf_liberacao varchar(11) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	IND_motivo_liberacao varchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	IND_ativo int DEFAULT 1 NOT NULL,
	IND_codigo int IDENTITY(1,1) NOT NULL,
	IND_user varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL,
	CONSTRAINT PK_IND_Inadimplencia PRIMARY KEY (IND_codigo),
	CONSTRAINT UQ_Inadimplencia UNIQUE (IND_codigo_EVA,IND_cpf_inadimplente,IND_user)
);


-- pibicdb.dbo.INI_INSCRICAO_IDIOMA definição

-- Drop table

-- DROP TABLE pibicdb.dbo.INI_INSCRICAO_IDIOMA;

CREATE TABLE pibicdb.dbo.INI_INSCRICAO_IDIOMA (
	INI_CODIGO int IDENTITY(1,1) NOT NULL,
	INI_CPF_BOLSITA varchar(11) COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL,
	INI_CODIGO_IDIOMA int NOT NULL,
	INI_PRIORIDADE int NOT NULL,
	INI_USUARIO varchar(11) COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL,
	INI_CH_CONHECIMENTO_LINGUA char(1) COLLATE SQL_Latin1_General_CP1_CI_AI DEFAULT 'N' NOT NULL,
	CONSTRAINT pk_inscricao_idioma PRIMARY KEY (INI_CODIGO)
);


-- pibicdb.dbo.INI_INSCRICAO_IDIOMA_AUD definição

-- Drop table

-- DROP TABLE pibicdb.dbo.INI_INSCRICAO_IDIOMA_AUD;

CREATE TABLE pibicdb.dbo.INI_INSCRICAO_IDIOMA_AUD (
	INI_CODIGO_AUD int IDENTITY(1,1) NOT NULL,
	INI_CODIGO int NOT NULL,
	INI_CPF_BOLSITA varchar(11) COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL,
	INI_CODIGO_IDIOMA int NOT NULL,
	INI_PRIORIDADE int NOT NULL,
	INI_USUARIO varchar(11) COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL,
	INI_TIPO varchar(1) COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL,
	INI_DT_ATUALIZACAO datetime NOT NULL,
	CONSTRAINT pk_inscricao_idioma_aud PRIMARY KEY (INI_CODIGO_AUD)
);


-- pibicdb.dbo.IPR_ItemAvaliacaoProjeto definição

-- Drop table

-- DROP TABLE pibicdb.dbo.IPR_ItemAvaliacaoProjeto;

CREATE TABLE pibicdb.dbo.IPR_ItemAvaliacaoProjeto (
	IPR_codigo int IDENTITY(1,1) NOT NULL,
	IPR_descricao char(100) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	CONSTRAINT PK_IPR_ItemAvaliacaoProjeto PRIMARY KEY (IPR_codigo)
);


-- pibicdb.dbo.ISC_ImportarSubComite$ definição

-- Drop table

-- DROP TABLE pibicdb.dbo.ISC_ImportarSubComite$;

CREATE TABLE pibicdb.dbo.ISC_ImportarSubComite$ (
	SCO_codigo int NULL,
	SCO_sigla nvarchar(255) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	SCO_codigo_EVA int NULL,
	SCO_descricao nvarchar(255) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	SCO_CpfTitular nvarchar(255) COLLATE SQL_Latin1_General_CP1_CI_AI NULL
);


-- pibicdb.dbo.ISS_ImportarSubAreaSubComite$ definição

-- Drop table

-- DROP TABLE pibicdb.dbo.ISS_ImportarSubAreaSubComite$;

CREATE TABLE pibicdb.dbo.ISS_ImportarSubAreaSubComite$ (
	SSC_codigo float NULL,
	SSC_codigo_SAR float NULL,
	SSC_codigo_SCO float NULL
);


-- pibicdb.dbo.ITA_ItemAvaliacao definição

-- Drop table

-- DROP TABLE pibicdb.dbo.ITA_ItemAvaliacao;

CREATE TABLE pibicdb.dbo.ITA_ItemAvaliacao (
	ITA_codigo int IDENTITY(1,1) NOT NULL,
	ITA_descricao varchar(300) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	CONSTRAINT PK_ITA_ItemAvaliacao PRIMARY KEY (ITA_codigo)
);


-- pibicdb.dbo.LTX_Lattes_Xml definição

-- Drop table

-- DROP TABLE pibicdb.dbo.LTX_Lattes_Xml;

CREATE TABLE pibicdb.dbo.LTX_Lattes_Xml (
	LTX_codigo int IDENTITY(1,1) NOT NULL,
	LTX_cpf varchar(11) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	LTX_nomeArquivo varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	LTX_bytes varbinary(MAX) NULL,
	LTX_codigoPEP int NOT NULL,
	CONSTRAINT pk_ltx_codigo PRIMARY KEY (LTX_codigo)
);


-- pibicdb.dbo.NOT_Noticia_user definição

-- Drop table

-- DROP TABLE pibicdb.dbo.NOT_Noticia_user;

CREATE TABLE pibicdb.dbo.NOT_Noticia_user (
	NOT_codigo int IDENTITY(1,1) NOT NULL,
	NOT_descricao text COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL,
	NOT_data datetime NOT NULL,
	NOT_titulo varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL,
	NOT_user varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AI DEFAULT suser_sname() NOT NULL,
	NOT_disponivel char(1) COLLATE SQL_Latin1_General_CP1_CI_AI DEFAULT 'S' NULL,
	CONSTRAINT PK_NOT_Noticia PRIMARY KEY (NOT_codigo)
);


-- pibicdb.dbo.PEE_PesquisadorExterno definição

-- Drop table

-- DROP TABLE pibicdb.dbo.PEE_PesquisadorExterno;

CREATE TABLE pibicdb.dbo.PEE_PesquisadorExterno (
	PEE_CpfOrientador varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL
);


-- pibicdb.dbo.PEP_PeriodoPrograma_user_AUD definição

-- Drop table

-- DROP TABLE pibicdb.dbo.PEP_PeriodoPrograma_user_AUD;

CREATE TABLE pibicdb.dbo.PEP_PeriodoPrograma_user_AUD (
	PEP_Codigo int NOT NULL,
	PEP_Codigo_PRO int NOT NULL,
	PEP_Codigo_PPS int NULL,
	PEP_Sigla varchar(30) COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL,
	PEP_Descricao varchar(200) COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL,
	PEP_DtInicio datetime NULL,
	PEP_DtFim datetime NULL,
	PEP_Edital varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	PEP_EditalArquivo varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	PEP_nmProjetos int NULL,
	PEP_nmPlanos int NULL,
	PEP_nmAvaliadores int NULL,
	PEP_avaliarProjeto int NULL,
	PEP_user varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL,
	PEP_Codigo_AUD int IDENTITY(1,1) NOT NULL,
	PEP_tipo varchar(25) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	PEP_dt_exclusao datetime NULL,
	PEP_usuario varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	CONSTRAINT PK_PEP_PeriodoPrograma_AUD PRIMARY KEY (PEP_Codigo_AUD)
);


-- pibicdb.dbo.PER_Perfil definição

-- Drop table

-- DROP TABLE pibicdb.dbo.PER_Perfil;

CREATE TABLE pibicdb.dbo.PER_Perfil (
	PER_papel varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL,
	PER_user varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AI DEFAULT suser_sname() NOT NULL,
	PER_cpf varchar(11) COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL,
	CONSTRAINT PK__PER_Perfil__797DF6D1 PRIMARY KEY (PER_papel,PER_user,PER_cpf)
);


-- pibicdb.dbo.PPS_PeriodoProgramaStatus definição

-- Drop table

-- DROP TABLE pibicdb.dbo.PPS_PeriodoProgramaStatus;

CREATE TABLE pibicdb.dbo.PPS_PeriodoProgramaStatus (
	PPS_Codigo int IDENTITY(1,1) NOT NULL,
	PPS_Descricao varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL,
	PPS_observacao varchar(200) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	CONSTRAINT PK_PPS_PeriodoProgramaStatus PRIMARY KEY (PPS_Codigo)
);


-- pibicdb.dbo.PRC_ProgramaCategoria definição

-- Drop table

-- DROP TABLE pibicdb.dbo.PRC_ProgramaCategoria;

CREATE TABLE pibicdb.dbo.PRC_ProgramaCategoria (
	PRC_Codigo int IDENTITY(1,1) NOT NULL,
	PRC_Sigla varchar(30) COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL,
	PRC_Descricao varchar(200) COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL,
	CONSTRAINT PK_PRC_ProgramaCategoria PRIMARY KEY (PRC_Codigo)
);


-- pibicdb.dbo.PRJ_Projeto_AUD definição

-- Drop table

-- DROP TABLE pibicdb.dbo.PRJ_Projeto_AUD;

CREATE TABLE pibicdb.dbo.PRJ_Projeto_AUD (
	PRJ_codigo_AUD int IDENTITY(1,1) NOT NULL,
	PRJ_codigo int NOT NULL,
	PRJ_codigo_PEP int NOT NULL,
	PRJ_titulo varchar(400) COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL,
	PRJ_cpfOrientador varchar(11) COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL,
	PRJ_resumo varchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL,
	PRJ_codigo_PRS int NULL,
	PRJ_certificadoDigital char(10) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	PRJ_notaProjetoCE real NULL,
	PRJ_notaOrientadorCE real NULL,
	PRJ_palavraschave varchar(200) COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL,
	PRJ_codigo_APO int NULL,
	PRJ_codigo_SAR int NULL,
	PRJ_outroApoio varchar(200) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	PRJ_cvLattes varchar(200) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	PRJ_codigo_UND char(6) COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL,
	prj_nmPlanosSubmetidos int DEFAULT 0 NULL,
	prj_flagBloqueado bit DEFAULT 0 NULL,
	prj_qtdLiberados int DEFAULT 0 NULL,
	prj_codigo_siatex varchar(25) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	PRJ_tipo varchar(25) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	PRJ_dt_exclusao datetime NULL,
	PRJ_usuario varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	CONSTRAINT PK__PRJ_Projeto_AUD PRIMARY KEY (PRJ_codigo_AUD)
);


-- pibicdb.dbo.PRS_ProjetoStatus definição

-- Drop table

-- DROP TABLE pibicdb.dbo.PRS_ProjetoStatus;

CREATE TABLE pibicdb.dbo.PRS_ProjetoStatus (
	PRS_codigo int NOT NULL,
	PRS_descricao varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	PRS_observacao varchar(200) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	CONSTRAINT PK_PRS_ProjetoStatus PRIMARY KEY (PRS_codigo)
);


-- pibicdb.dbo.PTR_PlanoTrabalho_AUD definição

-- Drop table

-- DROP TABLE pibicdb.dbo.PTR_PlanoTrabalho_AUD;

CREATE TABLE pibicdb.dbo.PTR_PlanoTrabalho_AUD (
	PTR_codigo int NOT NULL,
	PTR_codigo_AGE int NULL,
	PTR_codigo_PRJ int NOT NULL,
	PTR_subtitulo varchar(400) COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL,
	PTR_resumo varchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL,
	PTR_justificativa varchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL,
	PTR_Cpfaluno varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	PTR_nu_prioridade int NULL,
	PTR_codigo_AUD int IDENTITY(1,1) NOT NULL,
	PTR_tipo varchar(25) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	PTR_dt_exclusao datetime NULL,
	PTR_usuario varchar(25) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	CONSTRAINT PK_PTR_PlanoTrabalho_AUD PRIMARY KEY (PTR_codigo_AUD)
);


-- pibicdb.dbo.QTB_Planilha definição

-- Drop table

-- DROP TABLE pibicdb.dbo.QTB_Planilha;

CREATE TABLE pibicdb.dbo.QTB_Planilha (
	concedidas int NULL,
	plano int NULL
);


-- pibicdb.dbo.QTB_Quantidade_Bolsas definição

-- Drop table

-- DROP TABLE pibicdb.dbo.QTB_Quantidade_Bolsas;

CREATE TABLE pibicdb.dbo.QTB_Quantidade_Bolsas (
	QTB_codigo int IDENTITY(1,1) NOT NULL,
	QTB_codigo_PRJ int NULL,
	QTB_bolsas_homologadas int NULL,
	QTB_bolsas_concedidas int NULL,
	QTB_bolsas_indicadas int DEFAULT 0 NOT NULL,
	QTB_codigo_PTR int NULL,
	CONSTRAINT pk_qtb PRIMARY KEY (QTB_codigo)
);


-- pibicdb.dbo.RAV_RelatorioAvaliador_AUD definição

-- Drop table

-- DROP TABLE pibicdb.dbo.RAV_RelatorioAvaliador_AUD;

CREATE TABLE pibicdb.dbo.RAV_RelatorioAvaliador_AUD (
	RAV_codigo_AUD int IDENTITY(1,1) NOT NULL,
	RAV_codigo int NOT NULL,
	RAV_codigo_CAR int NULL,
	RAV_codigo_COM int NOT NULL,
	RAV_codigo_RPT int NULL,
	RAV_dataDistribuicao datetime NOT NULL,
	RAV_parecer text COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	RAV_tipo varchar(25) COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL,
	RAV_dt_exclusao datetime NOT NULL,
	RAV_usuario varchar(11) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	CONSTRAINT PK_RAV_RelatorioAvaliador_AUD PRIMARY KEY (RAV_codigo_AUD)
);


-- pibicdb.dbo.REC_RECIBO definição

-- Drop table

-- DROP TABLE pibicdb.dbo.REC_RECIBO;

CREATE TABLE pibicdb.dbo.REC_RECIBO (
	REC_codigo int IDENTITY(1,1) NOT NULL,
	REC_chave varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL,
	REC_data_hora datetime NOT NULL,
	REC_tipo varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL,
	REC_ip varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL,
	REC_codigo_referencia int NOT NULL,
	CONSTRAINT PK_REC_RECIBO PRIMARY KEY (REC_codigo)
);


-- pibicdb.dbo.RPS_RelatorioPlanoStatus definição

-- Drop table

-- DROP TABLE pibicdb.dbo.RPS_RelatorioPlanoStatus;

CREATE TABLE pibicdb.dbo.RPS_RelatorioPlanoStatus (
	RPS_codigo int IDENTITY(1,1) NOT NULL,
	RPS_descricao nchar(25) COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL,
	CONSTRAINT PK_RPS_RelatorioPlanoStatus PRIMARY KEY (RPS_codigo)
);


-- pibicdb.dbo.RPT_RelatorioPlanoTrabalho_AUD definição

-- Drop table

-- DROP TABLE pibicdb.dbo.RPT_RelatorioPlanoTrabalho_AUD;

CREATE TABLE pibicdb.dbo.RPT_RelatorioPlanoTrabalho_AUD (
	RPT_codigo_AUD int IDENTITY(1,1) NOT NULL,
	RPT_codigo int NOT NULL,
	RPT_codigo_PTR int NOT NULL,
	RPT_codigo_RES int NOT NULL,
	RPT_codigo_RPS int NULL,
	RPT_tipo varchar(25) COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL,
	RPT_dt_exclusao datetime NOT NULL,
	RPT_usuario varchar(11) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	CONSTRAINT PK_RPT_RelatorioPlanoTrabalho_AUD PRIMARY KEY (RPT_codigo_AUD)
);


-- pibicdb.dbo.SRE_StatusRecurso definição

-- Drop table

-- DROP TABLE pibicdb.dbo.SRE_StatusRecurso;

CREATE TABLE pibicdb.dbo.SRE_StatusRecurso (
	SRE_codigo int IDENTITY(1,1) NOT NULL,
	SRE_nome varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL,
	CONSTRAINT PK_SRE_StatusRecurso PRIMARY KEY (SRE_codigo)
);


-- pibicdb.dbo.STB_SituacaoBolsista definição

-- Drop table

-- DROP TABLE pibicdb.dbo.STB_SituacaoBolsista;

CREATE TABLE pibicdb.dbo.STB_SituacaoBolsista (
	STB_codigo int NOT NULL,
	STB_descricao varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	STB_ref varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	CONSTRAINT PK_STB_SituacaoBolsista PRIMARY KEY (STB_codigo)
);


-- pibicdb.dbo.STC_StatusComite definição

-- Drop table

-- DROP TABLE pibicdb.dbo.STC_StatusComite;

CREATE TABLE pibicdb.dbo.STC_StatusComite (
	STC_codigo int IDENTITY(1,1) NOT NULL,
	STC_descricao varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	CONSTRAINT PK_STC_StatusComite PRIMARY KEY (STC_codigo)
);


-- pibicdb.dbo.TCO_TipoComite definição

-- Drop table

-- DROP TABLE pibicdb.dbo.TCO_TipoComite;

CREATE TABLE pibicdb.dbo.TCO_TipoComite (
	TCO_codigo int NOT NULL,
	TCO_descricao varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	CONSTRAINT PK_TCO_TipoComite PRIMARY KEY (TCO_codigo)
);


-- pibicdb.dbo.TPA_TipoProducaoArtes definição

-- Drop table

-- DROP TABLE pibicdb.dbo.TPA_TipoProducaoArtes;

CREATE TABLE pibicdb.dbo.TPA_TipoProducaoArtes (
	TPA_producao nvarchar(255) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	TPA_natureza nvarchar(255) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	TPA_pais nvarchar(255) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	TPA_tipo_evento nvarchar(255) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	TPA_atividade_autor nvarchar(255) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	TPA_tipo int NULL
);


-- pibicdb.dbo.TPR_TipoRecurso definição

-- Drop table

-- DROP TABLE pibicdb.dbo.TPR_TipoRecurso;

CREATE TABLE pibicdb.dbo.TPR_TipoRecurso (
	TPR_nome varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL,
	TPR_codigo int IDENTITY(1,1) NOT NULL,
	CONSTRAINT PK_TPR_TipoRecurso PRIMARY KEY (TPR_codigo)
);


-- pibicdb.dbo.UNI_Unidade definição

-- Drop table

-- DROP TABLE pibicdb.dbo.UNI_Unidade;

CREATE TABLE pibicdb.dbo.UNI_Unidade (
	UNI_codigo int NOT NULL,
	UNI_descricao char(60) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	CONSTRAINT PK_UNI_Unidade PRIMARY KEY (UNI_codigo)
);


-- pibicdb.dbo.PRO_Programa definição

-- Drop table

-- DROP TABLE pibicdb.dbo.PRO_Programa;

CREATE TABLE pibicdb.dbo.PRO_Programa (
	PRO_Codigo int IDENTITY(1,1) NOT NULL,
	PRO_Codigo_PRC int NOT NULL,
	PRO_Sigla varchar(30) COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL,
	PRO_Descricao varchar(200) COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL,
	CONSTRAINT PK_PRO_Programa PRIMARY KEY (PRO_Codigo),
	CONSTRAINT FK_PRO_Programa_PRC_ProgramaCategoria FOREIGN KEY (PRO_Codigo_PRC) REFERENCES pibicdb.dbo.PRC_ProgramaCategoria(PRC_Codigo)
);


-- pibicdb.dbo.SAR_Subarea_user definição

-- Drop table

-- DROP TABLE pibicdb.dbo.SAR_Subarea_user;

CREATE TABLE pibicdb.dbo.SAR_Subarea_user (
	SAR_codigo int IDENTITY(1,1) NOT NULL,
	SAR_codigo_ARE int NOT NULL,
	SAR_nmCnpq char(20) COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL,
	SAR_ref varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL,
	SAR_descricao varchar(150) COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL,
	SAR_user varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AI DEFAULT suser_sname() NULL,
	SAR_ch_ativo char(1) COLLATE SQL_Latin1_General_CP1_CI_AI DEFAULT 'S' NOT NULL,
	CONSTRAINT PK_SAR_Subarea PRIMARY KEY (SAR_codigo),
	CONSTRAINT FK_SAR_Subarea_ARE_Area FOREIGN KEY (SAR_codigo_ARE) REFERENCES pibicdb.dbo.ARE_Area_user(ARE_codigo)
);


-- pibicdb.dbo.SSA_SubSubArea definição

-- Drop table

-- DROP TABLE pibicdb.dbo.SSA_SubSubArea;

CREATE TABLE pibicdb.dbo.SSA_SubSubArea (
	SSA_codigo int IDENTITY(1,1) NOT NULL,
	SSA_codigo_SAR int NULL,
	SSA_descricao char(50) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	CONSTRAINT PK_SSA_SubSubArea PRIMARY KEY (SSA_codigo),
	CONSTRAINT FK_SSA_SubSubArea_SAR_Subarea FOREIGN KEY (SSA_codigo_SAR) REFERENCES pibicdb.dbo.SAR_Subarea_user(SAR_codigo)
);


-- pibicdb.dbo.COM_Comite definição

-- Drop table

-- DROP TABLE pibicdb.dbo.COM_Comite;

CREATE TABLE pibicdb.dbo.COM_Comite (
	COM_codigo int IDENTITY(1,1) NOT NULL,
	COM_codigo_SAR int NULL,
	COM_bolsaProdutividade int NULL,
	COM_cpfComite varchar(11) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	COM_usuario varchar(11) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	CONSTRAINT PK_COM_Comite PRIMARY KEY (COM_codigo),
	CONSTRAINT FK_COM_Comite_SAR_Subarea FOREIGN KEY (COM_codigo_SAR) REFERENCES pibicdb.dbo.SAR_Subarea_user(SAR_codigo)
);


-- pibicdb.dbo.PEP_PeriodoPrograma_user definição

-- Drop table

-- DROP TABLE pibicdb.dbo.PEP_PeriodoPrograma_user;

CREATE TABLE pibicdb.dbo.PEP_PeriodoPrograma_user (
	PEP_Codigo int IDENTITY(1,1) NOT NULL,
	PEP_Codigo_PRO int NOT NULL,
	PEP_Codigo_PPS int NULL,
	PEP_Sigla varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL,
	PEP_Descricao varchar(200) COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL,
	PEP_DtInicio datetime NULL,
	PEP_DtFim datetime NULL,
	PEP_Edital varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	PEP_EditalArquivo varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	PEP_nmProjetos int NULL,
	PEP_nmPlanos int NULL,
	PEP_nmAvaliadores int NULL,
	PEP_avaliarProjeto int NULL,
	PEP_user varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AI DEFAULT suser_sname() NOT NULL,
	PEP_cpf_usuario varchar(25) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	CONSTRAINT PK_PEP_PeriodoPrograma PRIMARY KEY (PEP_Codigo),
	CONSTRAINT FK_PEP_PeriodoPrograma_PPS_PeriodoProgramaStatus FOREIGN KEY (PEP_Codigo_PPS) REFERENCES pibicdb.dbo.PPS_PeriodoProgramaStatus(PPS_Codigo),
	CONSTRAINT FK_PEP_PeriodoPrograma_PRO_Programa FOREIGN KEY (PEP_Codigo_PRO) REFERENCES pibicdb.dbo.PRO_Programa(PRO_Codigo)
);


-- pibicdb.dbo.PRJ_Projeto definição

-- Drop table

-- DROP TABLE pibicdb.dbo.PRJ_Projeto;

CREATE TABLE pibicdb.dbo.PRJ_Projeto (
	PRJ_codigo int IDENTITY(1,1) NOT NULL,
	PRJ_codigo_PEP int NOT NULL,
	PRJ_titulo varchar(400) COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL,
	PRJ_cpfOrientador varchar(11) COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL,
	PRJ_resumo varchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL,
	PRJ_codigo_PRS int NULL,
	PRJ_certificadoDigital char(10) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	PRJ_notaProjetoCE real NULL,
	PRJ_notaOrientadorCE real NULL,
	PRJ_palavraschave varchar(200) COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL,
	PRJ_codigo_APO int NULL,
	PRJ_codigo_SAR int NULL,
	PRJ_outroApoio varchar(200) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	PRJ_cvLattes varchar(200) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	PRJ_codigo_UND char(6) COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL,
	prj_nmPlanosSubmetidos int DEFAULT 0 NULL,
	prj_flagBloqueado bit DEFAULT 0 NULL,
	prj_qtdLiberados int DEFAULT 0 NULL,
	prj_codigo_siatex int NULL,
	PRJ_cpf_usuario varchar(25) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	PRJ_eixo varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	PRJ_titulacaoOrientador varchar(300) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	CONSTRAINT PK_PRJ_Projeto PRIMARY KEY (PRJ_codigo),
	CONSTRAINT FK_PRJ_Projeto_APO_Apoio FOREIGN KEY (PRJ_codigo_APO) REFERENCES pibicdb.dbo.APO_Apoio(APO_codigo),
	CONSTRAINT FK_PRJ_Projeto_PEP_PeriodoPrograma FOREIGN KEY (PRJ_codigo_PEP) REFERENCES pibicdb.dbo.PEP_PeriodoPrograma_user(PEP_Codigo),
	CONSTRAINT FK_PRJ_Projeto_PRS_ProjetoStatus FOREIGN KEY (PRJ_codigo_PRS) REFERENCES pibicdb.dbo.PRS_ProjetoStatus(PRS_codigo),
	CONSTRAINT FK_PRJ_Projeto_SAR_Subarea FOREIGN KEY (PRJ_codigo_SAR) REFERENCES pibicdb.dbo.SAR_Subarea_user(SAR_codigo)
);


-- pibicdb.dbo.PTR_PlanoTrabalho definição

-- Drop table

-- DROP TABLE pibicdb.dbo.PTR_PlanoTrabalho;

CREATE TABLE pibicdb.dbo.PTR_PlanoTrabalho (
	PTR_codigo int IDENTITY(1,1) NOT NULL,
	PTR_codigo_AGE int NULL,
	PTR_codigo_PRJ int NOT NULL,
	PTR_subTitulo varchar(400) COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL,
	PTR_resumo varchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL,
	PTR_justificativa varchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL,
	PTR_Cpfaluno varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	PTR_nu_prioridade int NULL,
	PTR_cpf_usuario varchar(25) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	CONSTRAINT PK_PTR_PlanoTrabalho PRIMARY KEY (PTR_codigo),
	CONSTRAINT FK_PTR_PlanoTrabalho_AGE_AgenciaFinanciadora FOREIGN KEY (PTR_codigo_AGE) REFERENCES pibicdb.dbo.AGE_AgenciaFinanciadora_user(AGE_Codigo),
	CONSTRAINT FK_PTR_PlanoTrabalho_PRJ_Projeto FOREIGN KEY (PTR_codigo_PRJ) REFERENCES pibicdb.dbo.PRJ_Projeto(PRJ_codigo)
);


-- pibicdb.dbo.RES_RelatorioSequencia definição

-- Drop table

-- DROP TABLE pibicdb.dbo.RES_RelatorioSequencia;

CREATE TABLE pibicdb.dbo.RES_RelatorioSequencia (
	RES_codigo int IDENTITY(1,1) NOT NULL,
	RES_codigo_PEP int NULL,
	RES_descricao varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	RES_modelo text COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	RES_nmAvaliadores int NULL,
	CONSTRAINT PK_RES_RelatorioSequencia PRIMARY KEY (RES_codigo),
	CONSTRAINT FK_RES_RelatorioSequencia_PEP_PeriodoPrograma FOREIGN KEY (RES_codigo_PEP) REFERENCES pibicdb.dbo.PEP_PeriodoPrograma_user(PEP_Codigo)
);


-- pibicdb.dbo.RPT_RelatorioPlanoTrabalho definição

-- Drop table

-- DROP TABLE pibicdb.dbo.RPT_RelatorioPlanoTrabalho;

CREATE TABLE pibicdb.dbo.RPT_RelatorioPlanoTrabalho (
	RPT_codigo int IDENTITY(1,1) NOT NULL,
	RPT_codigo_PTR int NOT NULL,
	RPT_codigo_RES int NOT NULL,
	RPT_codigo_RPS int NULL,
	RPT_usuario varchar(11) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	CONSTRAINT PK_RPT_RelatorioPlanoTrabalho PRIMARY KEY (RPT_codigo),
	CONSTRAINT FK_RPT_RelatorioPlanoTrabalho_PTR_PlanoTrabalho FOREIGN KEY (RPT_codigo_PTR) REFERENCES pibicdb.dbo.PTR_PlanoTrabalho(PTR_codigo),
	CONSTRAINT FK_RPT_RelatorioPlanoTrabalho_RES_RelatorioSequencia FOREIGN KEY (RPT_codigo_RES) REFERENCES pibicdb.dbo.RES_RelatorioSequencia(RES_codigo),
	CONSTRAINT FK_RPT_RelatorioPlanoTrabalho_RPS_RelatorioPlanoStatus FOREIGN KEY (RPT_codigo_RPS) REFERENCES pibicdb.dbo.RPS_RelatorioPlanoStatus(RPS_codigo)
);
 CREATE UNIQUE NONCLUSTERED INDEX idx_plano_relatorio_status ON pibicdb.dbo.RPT_RelatorioPlanoTrabalho (  RPT_codigo_PTR ASC  , RPT_codigo_RES ASC  , RPT_codigo_RPS ASC  )  
	 WITH (  PAD_INDEX = OFF ,FILLFACTOR = 100  ,SORT_IN_TEMPDB = OFF , IGNORE_DUP_KEY = OFF , STATISTICS_NORECOMPUTE = OFF , ONLINE = OFF , ALLOW_ROW_LOCKS = ON , ALLOW_PAGE_LOCKS = ON  )
	 ON [PRIMARY ] ;


-- pibicdb.dbo.TTR_Tutor definição

-- Drop table

-- DROP TABLE pibicdb.dbo.TTR_Tutor;

CREATE TABLE pibicdb.dbo.TTR_Tutor (
	TTR_codigo int IDENTITY(1,1) NOT NULL,
	TTR_codigo_PTR int NOT NULL,
	TTR_dataInicio datetime NULL,
	TTR_dataFim datetime NULL,
	TTR_cpf varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL,
	CONSTRAINT PK_TTR_Tutor PRIMARY KEY (TTR_codigo),
	CONSTRAINT FK_TTR_Tutor_PTR_PlanoTrabalho FOREIGN KEY (TTR_codigo_PTR) REFERENCES pibicdb.dbo.PTR_PlanoTrabalho(PTR_codigo)
);


-- pibicdb.dbo.AGB_AgenciaFinanciadoraPEP definição

-- Drop table

-- DROP TABLE pibicdb.dbo.AGB_AgenciaFinanciadoraPEP;

CREATE TABLE pibicdb.dbo.AGB_AgenciaFinanciadoraPEP (
	AGB_Codigo int IDENTITY(1,1) NOT NULL,
	AGB_Codigo_PEP int NOT NULL,
	AGB_Codigo_AGE int NOT NULL,
	AGB_BolsasOferecidas int NOT NULL,
	AGB_BolsasUtilizadas int NULL,
	AGB_descricao char(80) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	AGB_cpf_usuario varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	CONSTRAINT PK_AGB_AgenciaFinanciadoraPEP PRIMARY KEY (AGB_Codigo),
	CONSTRAINT FK_AGB_AgenciaFinanciadoraPEP_AGE_AgenciaFinanciadora FOREIGN KEY (AGB_Codigo_AGE) REFERENCES pibicdb.dbo.AGE_AgenciaFinanciadora_user(AGE_Codigo),
	CONSTRAINT FK_AGB_AgenciaFinanciadoraPEP_PEP_PeriodoPrograma FOREIGN KEY (AGB_Codigo_PEP) REFERENCES pibicdb.dbo.PEP_PeriodoPrograma_user(PEP_Codigo)
);


-- pibicdb.dbo.ATI_Atividade definição

-- Drop table

-- DROP TABLE pibicdb.dbo.ATI_Atividade;

CREATE TABLE pibicdb.dbo.ATI_Atividade (
	ATI_Codigo int IDENTITY(1,1) NOT NULL,
	ATI_Descricao varchar(150) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	ATI_codigo_RES int NULL,
	ATI_codigo_PEP int NULL,
	CONSTRAINT PK_ATI_Atividade PRIMARY KEY (ATI_Codigo),
	CONSTRAINT FK_ATI_Atividade_PEP_PeriodoPrograma FOREIGN KEY (ATI_codigo_PEP) REFERENCES pibicdb.dbo.PEP_PeriodoPrograma_user(PEP_Codigo),
	CONSTRAINT FK_ATI_Atividade_RES_RelatorioSequencia FOREIGN KEY (ATI_codigo_RES) REFERENCES pibicdb.dbo.RES_RelatorioSequencia(RES_codigo)
);


-- pibicdb.dbo.BOL_Bolsista definição

-- Drop table

-- DROP TABLE pibicdb.dbo.BOL_Bolsista;

CREATE TABLE pibicdb.dbo.BOL_Bolsista (
	BOL_codigo int IDENTITY(1,1) NOT NULL,
	BOL_cpfAluno varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	BOL_codigo_PTR int NULL,
	BOL_codigo_AGE int NULL,
	BOL_agenciaBB varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	BOL_contaBB varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	BOL_dataInicio datetime NULL,
	BOL_dataFim datetime NULL,
	BOL_codigo_STB int NULL,
	BOL_nmProcCNPq varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	BOL_codigo_BEO varchar(1) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	BOL_usuario varchar(11) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	CONSTRAINT PK_BOL_Bolsista PRIMARY KEY (BOL_codigo),
	CONSTRAINT FK_BOL_Bolsista_AGE_AgenciaFinanciadora FOREIGN KEY (BOL_codigo_AGE) REFERENCES pibicdb.dbo.AGE_AgenciaFinanciadora_user(AGE_Codigo),
	CONSTRAINT FK_BOL_Bolsista_BEO_BolsaExternaOrigem FOREIGN KEY (BOL_codigo_BEO) REFERENCES pibicdb.dbo.BEO_BolsaExternaOrigem(BEO_codigo),
	CONSTRAINT FK_BOL_Bolsista_PTR_PlanoTrabalho FOREIGN KEY (BOL_codigo_PTR) REFERENCES pibicdb.dbo.PTR_PlanoTrabalho(PTR_codigo),
	CONSTRAINT FK_BOL_Bolsista_STB_SituacaoBolsista FOREIGN KEY (BOL_codigo_STB) REFERENCES pibicdb.dbo.STB_SituacaoBolsista(STB_codigo)
);


-- pibicdb.dbo.CAR_ConceitoAvaliacaoRelatorio definição

-- Drop table

-- DROP TABLE pibicdb.dbo.CAR_ConceitoAvaliacaoRelatorio;

CREATE TABLE pibicdb.dbo.CAR_ConceitoAvaliacaoRelatorio (
	CAR_codigo int IDENTITY(1,1) NOT NULL,
	CAR_codigo_RES int NULL,
	CAR_descricao varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	CAR_nivel int NULL,
	CONSTRAINT PK_CAR_ConceitoAvaliacaoRelatorio PRIMARY KEY (CAR_codigo),
	CONSTRAINT FK_CAR_ConceitoAvaliacaoRelatorio_RES_RelatorioSequencia FOREIGN KEY (CAR_codigo_RES) REFERENCES pibicdb.dbo.RES_RelatorioSequencia(RES_codigo)
);


-- pibicdb.dbo.CAV_CategoriaAvaliacao definição

-- Drop table

-- DROP TABLE pibicdb.dbo.CAV_CategoriaAvaliacao;

CREATE TABLE pibicdb.dbo.CAV_CategoriaAvaliacao (
	CAV_codigo int IDENTITY(1,1) NOT NULL,
	CAV_codigo_PEP int NOT NULL,
	CAV_sigla varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL,
	CAV_descricao varchar(150) COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL,
	CONSTRAINT PK_CAV_CategoriaAvaliacao PRIMARY KEY (CAV_codigo),
	CONSTRAINT FK_CAV_CategoriaAvaliacao_PEP_PeriodoPrograma FOREIGN KEY (CAV_codigo_PEP) REFERENCES pibicdb.dbo.PEP_PeriodoPrograma_user(PEP_Codigo)
);


-- pibicdb.dbo.CIC_CategoriaItemCriterioPeriodoAvaliacaoRelatorio definição

-- Drop table

-- DROP TABLE pibicdb.dbo.CIC_CategoriaItemCriterioPeriodoAvaliacaoRelatorio;

CREATE TABLE pibicdb.dbo.CIC_CategoriaItemCriterioPeriodoAvaliacaoRelatorio (
	CIC_codigo int IDENTITY(1,1) NOT NULL,
	CIC_codigo_CRR int NULL,
	CIC_codigo_CTR int NULL,
	CIC_codigo_IAR int NULL,
	CIC_codigo_RES int NULL,
	CONSTRAINT PK_CIC_CategoriaItemCriterioPeriodoAvaliacaoRelatorio PRIMARY KEY (CIC_codigo),
	CONSTRAINT FK_CIC_CategoriaItemCriterioPeriodoAvaliacaoRelatorio_CRR_CriterioAvaliacaoRelatorio FOREIGN KEY (CIC_codigo_CRR) REFERENCES pibicdb.dbo.CRR_CriterioAvaliacaoRelatorio(CRR_codigo),
	CONSTRAINT FK_CIC_CategoriaItemCriterioPeriodoAvaliacaoRelatorio_CTR_CategoriaAvaliacaoRelatorio1 FOREIGN KEY (CIC_codigo_CTR) REFERENCES pibicdb.dbo.CTR_CategoriaAvaliacaoRelatorio(CTR_codigo),
	CONSTRAINT FK_CIC_CategoriaItemCriterioPeriodoAvaliacaoRelatorio_IAR_ItemAvaliacaoRelatorio FOREIGN KEY (CIC_codigo_IAR) REFERENCES pibicdb.dbo.IAR_ItemAvaliacaoRelatorio(IAR_codigo),
	CONSTRAINT FK_CIC_CategoriaItemCriterioPeriodoAvaliacaoRelatorio_RES_RelatorioSequencia FOREIGN KEY (CIC_codigo_RES) REFERENCES pibicdb.dbo.RES_RelatorioSequencia(RES_codigo) ON DELETE CASCADE
);


-- pibicdb.dbo.EVA_EventoAtividadePEP definição

-- Drop table

-- DROP TABLE pibicdb.dbo.EVA_EventoAtividadePEP;

CREATE TABLE pibicdb.dbo.EVA_EventoAtividadePEP (
	EVA_Codigo int IDENTITY(1,1) NOT NULL,
	EVA_Codigo_PEP int NULL,
	EVA_Codigo_EVE int NULL,
	EVA_Codigo_ATI int NULL,
	EVA_Codigo_GRI int NULL,
	EVA_DtInicio datetime NULL,
	EVA_DtFim datetime NULL,
	EVA_DtFimProrrogacao datetime NULL,
	EVA_cpf_usuario varchar(25) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	CONSTRAINT PK_EVA_EventoAtividadePEP PRIMARY KEY (EVA_Codigo),
	CONSTRAINT FK_EVA_EventoAtividadePEP_ATI_Atividade FOREIGN KEY (EVA_Codigo_ATI) REFERENCES pibicdb.dbo.ATI_Atividade(ATI_Codigo),
	CONSTRAINT FK_EVA_EventoAtividadePEP_EVE_Evento FOREIGN KEY (EVA_Codigo_EVE) REFERENCES pibicdb.dbo.EVE_Evento(EVE_Codigo),
	CONSTRAINT FK_EVA_EventoAtividadePEP_PEP_PeriodoPrograma FOREIGN KEY (EVA_Codigo_PEP) REFERENCES pibicdb.dbo.PEP_PeriodoPrograma_user(PEP_Codigo)
);


-- pibicdb.dbo.IAP_ItemAvaliacaoOrientadorPEP definição

-- Drop table

-- DROP TABLE pibicdb.dbo.IAP_ItemAvaliacaoOrientadorPEP;

CREATE TABLE pibicdb.dbo.IAP_ItemAvaliacaoOrientadorPEP (
	IAP_codigo int IDENTITY(1,1) NOT NULL,
	IAP_codigo_IAO int NULL,
	IAP_codigo_RES int NULL,
	IAP_variacaonota varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	CONSTRAINT PK_IAP_ItemAvaliacaoOrientadorPEP PRIMARY KEY (IAP_codigo),
	CONSTRAINT FK_IAP_ItemAvaliacaoOrientadorPEP_IAO_ItemAvaliacaoOrientador FOREIGN KEY (IAP_codigo_IAO) REFERENCES pibicdb.dbo.IAO_ItemAvaliacaoOrientador(IAO_codigo),
	CONSTRAINT FK_IAP_ItemAvaliacaoOrientadorPEP_RES_RelatorioSequencia FOREIGN KEY (IAP_codigo_RES) REFERENCES pibicdb.dbo.RES_RelatorioSequencia(RES_codigo)
);


-- pibicdb.dbo.IPP_ItemAvaliacaoProjetoPEP definição

-- Drop table

-- DROP TABLE pibicdb.dbo.IPP_ItemAvaliacaoProjetoPEP;

CREATE TABLE pibicdb.dbo.IPP_ItemAvaliacaoProjetoPEP (
	IPP_codigo int IDENTITY(1,1) NOT NULL,
	IPP_codigo_IPR int NULL,
	IPP_codigo_PEP int NULL,
	IPP_peso varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	CONSTRAINT PK_IPP_ItemAvaliacaoProjetoPEP PRIMARY KEY (IPP_codigo),
	CONSTRAINT FK_IPP_ItemAvaliacaoProjetoPEP_IPR_ItemAvaliacaoProjeto FOREIGN KEY (IPP_codigo_IPR) REFERENCES pibicdb.dbo.IPR_ItemAvaliacaoProjeto(IPR_codigo),
	CONSTRAINT FK_IPP_ItemAvaliacaoProjetoPEP_PEP_PeriodoPrograma FOREIGN KEY (IPP_codigo_PEP) REFERENCES pibicdb.dbo.PEP_PeriodoPrograma_user(PEP_Codigo)
);


-- pibicdb.dbo.IPS_ItemAvaliacaoPeso definição

-- Drop table

-- DROP TABLE pibicdb.dbo.IPS_ItemAvaliacaoPeso;

CREATE TABLE pibicdb.dbo.IPS_ItemAvaliacaoPeso (
	IPS_codigo int IDENTITY(1,1) NOT NULL,
	IPS_codigo_ITA int NOT NULL,
	IPS_codigo_SAR int NOT NULL,
	IPS_codigo_CAV int NOT NULL,
	IPS_peso real NOT NULL,
	IPS_pontuacaoMax real NOT NULL,
	IPS_ch_automatico char(1) COLLATE SQL_Latin1_General_CP1_CI_AI DEFAULT 'N' NOT NULL,
	CONSTRAINT PK_IPS_ItemAvaliacaoPeso PRIMARY KEY (IPS_codigo),
	CONSTRAINT FK_IPS_ItemAvaliacaoPeso_CAV_CategoriaAvaliacao FOREIGN KEY (IPS_codigo_CAV) REFERENCES pibicdb.dbo.CAV_CategoriaAvaliacao(CAV_codigo),
	CONSTRAINT FK_IPS_ItemAvaliacaoPeso_ITA_ItemAvaliacao FOREIGN KEY (IPS_codigo_ITA) REFERENCES pibicdb.dbo.ITA_ItemAvaliacao(ITA_codigo),
	CONSTRAINT FK_IPS_ItemAvaliacaoPeso_SAR_Subarea FOREIGN KEY (IPS_codigo_SAR) REFERENCES pibicdb.dbo.SAR_Subarea_user(SAR_codigo) ON DELETE CASCADE ON UPDATE CASCADE
);


-- pibicdb.dbo.IVP_ItemAvaliacaoBolsistaPEP definição

-- Drop table

-- DROP TABLE pibicdb.dbo.IVP_ItemAvaliacaoBolsistaPEP;

CREATE TABLE pibicdb.dbo.IVP_ItemAvaliacaoBolsistaPEP (
	IVP_codigo int IDENTITY(1,1) NOT NULL,
	IVP_codigo_IAB int NULL,
	IVP_codigo_RES int NULL,
	IVP_variacaoNota varchar(5) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	CONSTRAINT PK_IVP_ItemAvaliacaoBolsistaPEP PRIMARY KEY (IVP_codigo),
	CONSTRAINT FK_IVP_ItemAvaliacaoBolsistaPEP_IAB_ItemAvaliacaoBolsista FOREIGN KEY (IVP_codigo_IAB) REFERENCES pibicdb.dbo.IAB_ItemAvaliacaoBolsista(IAB_codigo),
	CONSTRAINT FK_IVP_ItemAvaliacaoBolsistaPEP_RES_RelatorioSequencia FOREIGN KEY (IVP_codigo_RES) REFERENCES pibicdb.dbo.RES_RelatorioSequencia(RES_codigo)
);


-- pibicdb.dbo.OAE_OrientadorAvaliacaoExterno definição

-- Drop table

-- DROP TABLE pibicdb.dbo.OAE_OrientadorAvaliacaoExterno;

CREATE TABLE pibicdb.dbo.OAE_OrientadorAvaliacaoExterno (
	OAE_codigo int IDENTITY(1,1) NOT NULL,
	OAE_codigo_PRJ int NOT NULL,
	OAE_codigo_IPS int NOT NULL,
	OAE_pontuacao int NOT NULL,
	CONSTRAINT PK_OAE_OrientadorAvaliacaoExterno PRIMARY KEY (OAE_codigo),
	CONSTRAINT FK_OAE_OrientadorAvaliacaoExterno_IPS_ItemAvaliacaoPeso FOREIGN KEY (OAE_codigo_IPS) REFERENCES pibicdb.dbo.IPS_ItemAvaliacaoPeso(IPS_codigo),
	CONSTRAINT FK_OAE_OrientadorAvaliacaoExterno_PRJ_Projeto FOREIGN KEY (OAE_codigo_PRJ) REFERENCES pibicdb.dbo.PRJ_Projeto(PRJ_codigo)
);


-- pibicdb.dbo.OAL_OrientadorAvaliacaoLocal definição

-- Drop table

-- DROP TABLE pibicdb.dbo.OAL_OrientadorAvaliacaoLocal;

CREATE TABLE pibicdb.dbo.OAL_OrientadorAvaliacaoLocal (
	OAL_codigo int IDENTITY(1,1) NOT NULL,
	OAL_codigo_PRJ int NOT NULL,
	OAL_codigo_IPS int NOT NULL,
	OAL_pontuacao int NOT NULL,
	CONSTRAINT PK_OAL_OrientadorAvaliacaoLocal PRIMARY KEY (OAL_codigo),
	CONSTRAINT FK_OAL_OrientadorAvaliacaoLocal_IPS_ItemAvaliacaoPeso FOREIGN KEY (OAL_codigo_IPS) REFERENCES pibicdb.dbo.IPS_ItemAvaliacaoPeso(IPS_codigo),
	CONSTRAINT FK_OAL_OrientadorAvaliacaoLocal_PRJ_Projeto FOREIGN KEY (OAL_codigo_PRJ) REFERENCES pibicdb.dbo.PRJ_Projeto(PRJ_codigo)
);


-- pibicdb.dbo.PAE_ProjetoAvaliacaoExterna definição

-- Drop table

-- DROP TABLE pibicdb.dbo.PAE_ProjetoAvaliacaoExterna;

CREATE TABLE pibicdb.dbo.PAE_ProjetoAvaliacaoExterna (
	PAE_codigo int IDENTITY(1,1) NOT NULL,
	PAE_codigo_IPP int NULL,
	PAE_pontuacao real NULL,
	PAE_data datetime NULL,
	PAE_codigo_PRJ int NULL,
	CONSTRAINT PK_PAE_ProjetoAvaliacaoExterna PRIMARY KEY (PAE_codigo),
	CONSTRAINT FK_PAE_ProjetoAvaliacaoExterna_IPP_ItemAvaliacaoProjetoPEP FOREIGN KEY (PAE_codigo_IPP) REFERENCES pibicdb.dbo.IPP_ItemAvaliacaoProjetoPEP(IPP_codigo),
	CONSTRAINT FK_PAE_ProjetoAvaliacaoExterna_PRJ_Projeto FOREIGN KEY (PAE_codigo_PRJ) REFERENCES pibicdb.dbo.PRJ_Projeto(PRJ_codigo)
);


-- pibicdb.dbo.PAL_ProjetoAvaliacaoLocal definição

-- Drop table

-- DROP TABLE pibicdb.dbo.PAL_ProjetoAvaliacaoLocal;

CREATE TABLE pibicdb.dbo.PAL_ProjetoAvaliacaoLocal (
	PAL_codigo int IDENTITY(1,1) NOT NULL,
	PAL_codigo_IPP int NULL,
	PAL_pontuacao real NULL,
	PAL_data datetime NULL,
	PAL_codigo_PRJ int NULL,
	CONSTRAINT PK_PAL_ProjetoAvaliacaoLocal PRIMARY KEY (PAL_codigo),
	CONSTRAINT FK_PAL_ProjetoAvaliacaoLocal_IPP_ItemAvaliacaoProjetoPEP FOREIGN KEY (PAL_codigo_IPP) REFERENCES pibicdb.dbo.IPP_ItemAvaliacaoProjetoPEP(IPP_codigo),
	CONSTRAINT FK_PAL_ProjetoAvaliacaoLocal_PRJ_Projeto FOREIGN KEY (PAL_codigo_PRJ) REFERENCES pibicdb.dbo.PRJ_Projeto(PRJ_codigo)
);


-- pibicdb.dbo.PAR_ProjetoAvaliador definição

-- Drop table

-- DROP TABLE pibicdb.dbo.PAR_ProjetoAvaliador;

CREATE TABLE pibicdb.dbo.PAR_ProjetoAvaliador (
	PAR_codigo int IDENTITY(1,1) NOT NULL,
	PAR_codigo_PRJ int NOT NULL,
	PAR_codigo_COM int NOT NULL,
	CONSTRAINT PK_PAR_ProjetoAvaliador PRIMARY KEY (PAR_codigo),
	CONSTRAINT FK_PAR_ProjetoAvaliador_COM_Comite FOREIGN KEY (PAR_codigo_COM) REFERENCES pibicdb.dbo.COM_Comite(COM_codigo),
	CONSTRAINT FK_PAR_ProjetoAvaliador_PRJ_Projeto FOREIGN KEY (PAR_codigo_PRJ) REFERENCES pibicdb.dbo.PRJ_Projeto(PRJ_codigo)
);


-- pibicdb.dbo.PAV_ProjetoAvaliacao definição

-- Drop table

-- DROP TABLE pibicdb.dbo.PAV_ProjetoAvaliacao;

CREATE TABLE pibicdb.dbo.PAV_ProjetoAvaliacao (
	PAV_codigo int IDENTITY(1,1) NOT NULL,
	PAV_codigo_IPP int NULL,
	PAV_pontuacao real NULL,
	PAV_data datetime NULL,
	PAV_codigo_PAR int NULL,
	CONSTRAINT PK_PAV_ProjetoAvaliacao PRIMARY KEY (PAV_codigo),
	CONSTRAINT FK_PAV_ProjetoAvaliacao_IPP_ItemAvaliacaoProjetoPEP FOREIGN KEY (PAV_codigo_IPP) REFERENCES pibicdb.dbo.IPP_ItemAvaliacaoProjetoPEP(IPP_codigo),
	CONSTRAINT FK_PAV_ProjetoAvaliacao_PAR_ProjetoAvaliador FOREIGN KEY (PAV_codigo_PAR) REFERENCES pibicdb.dbo.PAR_ProjetoAvaliador(PAR_codigo)
);


-- pibicdb.dbo.PCF_ProjetoConfiguracao definição

-- Drop table

-- DROP TABLE pibicdb.dbo.PCF_ProjetoConfiguracao;

CREATE TABLE pibicdb.dbo.PCF_ProjetoConfiguracao (
	PCF_codigo int IDENTITY(1,1) NOT NULL,
	PCF_codigo_PEP int NULL,
	PCF_nmProjetos int NULL,
	PCF_nmPlanos int NULL,
	PCF_nmAvaliadores int NULL,
	PCF_modelo text COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	PCF_nmMinPlanos int NULL,
	CONSTRAINT PK_PCF_ProjetoConfiguracao PRIMARY KEY (PCF_codigo),
	CONSTRAINT FK_PCF_ProjetoConfiguracao_PEP_PeriodoPrograma FOREIGN KEY (PCF_codigo_PEP) REFERENCES pibicdb.dbo.PEP_PeriodoPrograma_user(PEP_Codigo)
);


-- pibicdb.dbo.PCO_PapelComite definição

-- Drop table

-- DROP TABLE pibicdb.dbo.PCO_PapelComite;

CREATE TABLE pibicdb.dbo.PCO_PapelComite (
	PCO_codigo int IDENTITY(1,1) NOT NULL,
	PCO_codigo_COM int NULL,
	PCO_codigo_SAR int NULL,
	PCO_codigo_EVA int NULL,
	PCO_codigo_TCO int NULL,
	PCO_codigo_STC int NULL,
	CONSTRAINT PK_PCO_PapelComite PRIMARY KEY (PCO_codigo),
	CONSTRAINT FK_PCO_PapelComite_COM_Comite FOREIGN KEY (PCO_codigo_COM) REFERENCES pibicdb.dbo.COM_Comite(COM_codigo),
	CONSTRAINT FK_PCO_PapelComite_EVA_EventoAtividadePEP FOREIGN KEY (PCO_codigo_EVA) REFERENCES pibicdb.dbo.EVA_EventoAtividadePEP(EVA_Codigo),
	CONSTRAINT FK_PCO_PapelComite_SAR_Subarea FOREIGN KEY (PCO_codigo_SAR) REFERENCES pibicdb.dbo.SAR_Subarea_user(SAR_codigo),
	CONSTRAINT FK_PCO_PapelComite_STC_StatusComite FOREIGN KEY (PCO_codigo_STC) REFERENCES pibicdb.dbo.STC_StatusComite(STC_codigo),
	CONSTRAINT FK_PCO_PapelComite_TCO_TipoComite FOREIGN KEY (PCO_codigo_TCO) REFERENCES pibicdb.dbo.TCO_TipoComite(TCO_codigo)
);


-- pibicdb.dbo.PDC_ProDoc definição

-- Drop table

-- DROP TABLE pibicdb.dbo.PDC_ProDoc;

CREATE TABLE pibicdb.dbo.PDC_ProDoc (
	PDC_cpfOrientador varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL,
	PDC_codigo_PEP int NOT NULL,
	PDC_codigo int IDENTITY(1,1) NOT NULL,
	CONSTRAINT PK_PDC_ProDoc PRIMARY KEY (PDC_codigo),
	CONSTRAINT FK_PDC_ProDoc_PEP_PeriodoPrograma FOREIGN KEY (PDC_codigo_PEP) REFERENCES pibicdb.dbo.PEP_PeriodoPrograma_user(PEP_Codigo)
);


-- pibicdb.dbo.PLA_PlanoAvaliacao definição

-- Drop table

-- DROP TABLE pibicdb.dbo.PLA_PlanoAvaliacao;

CREATE TABLE pibicdb.dbo.PLA_PlanoAvaliacao (
	PLA_codigo int IDENTITY(1,1) NOT NULL,
	PLA_codigo_PAR int NULL,
	PLA_codigo_PTR int NULL,
	PLA_contexto int NULL,
	PLA_relevancia int NULL,
	PLA_parecer text COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	CONSTRAINT PK_PLA_PlanoAvaliacao PRIMARY KEY (PLA_codigo),
	CONSTRAINT FK_PLA_PlanoAvaliacao_PAR_ProjetoAvaliador FOREIGN KEY (PLA_codigo_PAR) REFERENCES pibicdb.dbo.PAR_ProjetoAvaliador(PAR_codigo),
	CONSTRAINT FK_PLA_PlanoAvaliacao_PTR_PlanoTrabalho FOREIGN KEY (PLA_codigo_PTR) REFERENCES pibicdb.dbo.PTR_PlanoTrabalho(PTR_codigo)
);


-- pibicdb.dbo.PLE_PlanoParecerExterno definição

-- Drop table

-- DROP TABLE pibicdb.dbo.PLE_PlanoParecerExterno;

CREATE TABLE pibicdb.dbo.PLE_PlanoParecerExterno (
	PLE_codigo int IDENTITY(1,1) NOT NULL,
	PLE_codigo_PTR int NULL,
	PLE_contexto int NULL,
	PLE_relevancia int NULL,
	PLE_parecer text COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	CONSTRAINT PK_PLE_PlanoParecerExterno PRIMARY KEY (PLE_codigo),
	CONSTRAINT FK_PLE_PlanoParecerExterno_PTR_PlanoTrabalho FOREIGN KEY (PLE_codigo_PTR) REFERENCES pibicdb.dbo.PTR_PlanoTrabalho(PTR_codigo)
);


-- pibicdb.dbo.PLL_PlanoAvaliacaoLocal definição

-- Drop table

-- DROP TABLE pibicdb.dbo.PLL_PlanoAvaliacaoLocal;

CREATE TABLE pibicdb.dbo.PLL_PlanoAvaliacaoLocal (
	PLL_codigo int IDENTITY(1,1) NOT NULL,
	PLL_codigo_PTR int NULL,
	PLL_contexto int NULL,
	PLL_relevancia int NULL,
	PLL_parecer text COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	CONSTRAINT PK_PLL_PlanoAvaliacaoLocal PRIMARY KEY (PLL_codigo),
	CONSTRAINT FK_PLL_PlanoAvaliacaoLocal_PTR_PlanoTrabalho FOREIGN KEY (PLL_codigo_PTR) REFERENCES pibicdb.dbo.PTR_PlanoTrabalho(PTR_codigo)
);


-- pibicdb.dbo.PLM_PlanoModelo definição

-- Drop table

-- DROP TABLE pibicdb.dbo.PLM_PlanoModelo;

CREATE TABLE pibicdb.dbo.PLM_PlanoModelo (
	PLM_codigo int IDENTITY(1,1) NOT NULL,
	PLM_codigo_PCF int NOT NULL,
	PLM_descricao varchar(200) COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL,
	PLM_ordem int NOT NULL,
	PLM_observacao varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	PLM_maxPalavras int NULL,
	CONSTRAINT PK_PLM_PlanoModelo PRIMARY KEY (PLM_codigo),
	CONSTRAINT FK_PLM_PlanoModelo_PCF_ProjetoConfiguracao FOREIGN KEY (PLM_codigo_PCF) REFERENCES pibicdb.dbo.PCF_ProjetoConfiguracao(PCF_codigo)
);


-- pibicdb.dbo.PPE_ProjetoParecerExterno definição

-- Drop table

-- DROP TABLE pibicdb.dbo.PPE_ProjetoParecerExterno;

CREATE TABLE pibicdb.dbo.PPE_ProjetoParecerExterno (
	PPE_codigo int IDENTITY(1,1) NOT NULL,
	PPE_codigo_PRJ int NULL,
	PPE_notaLattes real NULL,
	PPE_qntsBolsas int NULL,
	PPE_parecer text COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	PPE_submetido int NULL,
	PPE_notaProjeto real NULL,
	PPE_codigo_BPR int NULL,
	CONSTRAINT PK_PPE_ProjetoParecerExterno PRIMARY KEY (PPE_codigo),
	CONSTRAINT FK_PPE_ProjetoParecerExterno_BPR_BolsaProdutividade FOREIGN KEY (PPE_codigo_BPR) REFERENCES pibicdb.dbo.BPR_BolsaProdutividade(BPR_codigo),
	CONSTRAINT FK_PPE_ProjetoParecerExterno_PRJ_Projeto FOREIGN KEY (PPE_codigo_PRJ) REFERENCES pibicdb.dbo.PRJ_Projeto(PRJ_codigo)
);


-- pibicdb.dbo.PPL_ProjetoParecerLocal definição

-- Drop table

-- DROP TABLE pibicdb.dbo.PPL_ProjetoParecerLocal;

CREATE TABLE pibicdb.dbo.PPL_ProjetoParecerLocal (
	PPL_codigo int IDENTITY(1,1) NOT NULL,
	PPL_codigo_PRJ int NULL,
	PPL_notaLattes real NULL,
	PPL_qntBolsas int NULL,
	PPL_parecer text COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	PPL_submetido int NULL,
	PPL_notaProjeto real NULL,
	CONSTRAINT PK_PPL_ProjetoParecerLocal PRIMARY KEY (PPL_codigo),
	CONSTRAINT FK_PPL_ProjetoParecerLocal_PRJ_Projeto FOREIGN KEY (PPL_codigo_PRJ) REFERENCES pibicdb.dbo.PRJ_Projeto(PRJ_codigo)
);


-- pibicdb.dbo.PRM_ProjetoModelo definição

-- Drop table

-- DROP TABLE pibicdb.dbo.PRM_ProjetoModelo;

CREATE TABLE pibicdb.dbo.PRM_ProjetoModelo (
	PRM_codigo int IDENTITY(1,1) NOT NULL,
	PRM_codigo_PCF int NOT NULL,
	PRM_descricao varchar(200) COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL,
	PRM_ordem int NOT NULL,
	PRM_maxPalavras int NOT NULL,
	PRM_observacao varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL,
	CONSTRAINT PK_PRM_ProjetoModelo PRIMARY KEY (PRM_codigo),
	CONSTRAINT FK_PRM_ProjetoModelo_PCF_ProjetoConfiguracao FOREIGN KEY (PRM_codigo_PCF) REFERENCES pibicdb.dbo.PCF_ProjetoConfiguracao(PCF_codigo)
);


-- pibicdb.dbo.PRP_ProjetoParecer definição

-- Drop table

-- DROP TABLE pibicdb.dbo.PRP_ProjetoParecer;

CREATE TABLE pibicdb.dbo.PRP_ProjetoParecer (
	PRP_codigo int IDENTITY(1,1) NOT NULL,
	PRP_codigo_PAR int NULL,
	PRP_parecer text COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	PRP_qntBolsistas int NULL,
	PRP_codigo_PRJ int NULL,
	PRP_submetido int NULL,
	PRP_notaLattes real NULL,
	PRP_notaProjeto real NULL,
	CONSTRAINT PK_PRP_ProjetoParecer PRIMARY KEY (PRP_codigo),
	CONSTRAINT FK_PRP_ProjetoParecer_PAR_ProjetoAvaliador FOREIGN KEY (PRP_codigo_PAR) REFERENCES pibicdb.dbo.PAR_ProjetoAvaliador(PAR_codigo),
	CONSTRAINT FK_PRP_ProjetoParecer_PRJ_Projeto FOREIGN KEY (PRP_codigo_PRJ) REFERENCES pibicdb.dbo.PRJ_Projeto(PRJ_codigo)
);


-- pibicdb.dbo.RAE_RelatorioAvaliacaoExterna definição

-- Drop table

-- DROP TABLE pibicdb.dbo.RAE_RelatorioAvaliacaoExterna;

CREATE TABLE pibicdb.dbo.RAE_RelatorioAvaliacaoExterna (
	RAE_codigo int IDENTITY(1,1) NOT NULL,
	RAE_codigo_CIC int NOT NULL,
	RAE_codigo_RPT int NOT NULL,
	CONSTRAINT PK_RAE_codigo PRIMARY KEY (RAE_codigo),
	CONSTRAINT FK_RAE_codigo_CIC FOREIGN KEY (RAE_codigo_CIC) REFERENCES pibicdb.dbo.CIC_CategoriaItemCriterioPeriodoAvaliacaoRelatorio(CIC_codigo),
	CONSTRAINT FK_RAE_codigo_RPT FOREIGN KEY (RAE_codigo_RPT) REFERENCES pibicdb.dbo.RPT_RelatorioPlanoTrabalho(RPT_codigo)
);


-- pibicdb.dbo.RAV_RelatorioAvaliador definição

-- Drop table

-- DROP TABLE pibicdb.dbo.RAV_RelatorioAvaliador;

CREATE TABLE pibicdb.dbo.RAV_RelatorioAvaliador (
	RAV_codigo int IDENTITY(1,1) NOT NULL,
	RAV_codigo_CAR int NULL,
	RAV_codigo_COM int NOT NULL,
	RAV_codigo_RPT int NULL,
	RAV_dataDistribuicao datetime NOT NULL,
	RAV_parecer text COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	RAV_usuario varchar(11) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	CONSTRAINT PK_RAV_RelatorioAvaliador PRIMARY KEY (RAV_codigo),
	CONSTRAINT FK_RAV_RelatorioAvaliador_CAR_ConceitoAvaliacaoRelatorio FOREIGN KEY (RAV_codigo_CAR) REFERENCES pibicdb.dbo.CAR_ConceitoAvaliacaoRelatorio(CAR_codigo),
	CONSTRAINT FK_RAV_RelatorioAvaliador_COM_Comite FOREIGN KEY (RAV_codigo_COM) REFERENCES pibicdb.dbo.COM_Comite(COM_codigo),
	CONSTRAINT FK_RAV_RelatorioAvaliador_RPT_RelatorioPlanoTrabalho FOREIGN KEY (RAV_codigo_RPT) REFERENCES pibicdb.dbo.RPT_RelatorioPlanoTrabalho(RPT_codigo)
);


-- pibicdb.dbo.REA_RelatorioAvaliacao definição

-- Drop table

-- DROP TABLE pibicdb.dbo.REA_RelatorioAvaliacao;

CREATE TABLE pibicdb.dbo.REA_RelatorioAvaliacao (
	REA_codigo int IDENTITY(1,1) NOT NULL,
	REA_codigo_CIC int NULL,
	REA_codigo_RAV int NULL,
	REA_caminhoArquivoRelatorio varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	CONSTRAINT PK_REA_RelatorioAvaliacao PRIMARY KEY (REA_codigo),
	CONSTRAINT FK_REA_RelatorioAvaliacao_CIC_CategoriaItemCriterioPeriodoAvaliacaoRelatorio FOREIGN KEY (REA_codigo_CIC) REFERENCES pibicdb.dbo.CIC_CategoriaItemCriterioPeriodoAvaliacaoRelatorio(CIC_codigo),
	CONSTRAINT FK_REA_RelatorioAvaliacao_RAV_RelatorioAvaliador FOREIGN KEY (REA_codigo_RAV) REFERENCES pibicdb.dbo.RAV_RelatorioAvaliador(RAV_codigo)
);


-- pibicdb.dbo.RPE_RelatorioParecerExterno definição

-- Drop table

-- DROP TABLE pibicdb.dbo.RPE_RelatorioParecerExterno;

CREATE TABLE pibicdb.dbo.RPE_RelatorioParecerExterno (
	RPE_codigo int IDENTITY(1,1) NOT NULL,
	RPE_codigo_CAR int NOT NULL,
	RPE_codigo_RPT int NOT NULL,
	RPE_parecer text COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL,
	CONSTRAINT PK_RPE_codigo PRIMARY KEY (RPE_codigo),
	CONSTRAINT FK_RPE_codigo_CAR FOREIGN KEY (RPE_codigo_CAR) REFERENCES pibicdb.dbo.CAR_ConceitoAvaliacaoRelatorio(CAR_codigo),
	CONSTRAINT FK_RPE_codigo_RPT FOREIGN KEY (RPE_codigo_RPT) REFERENCES pibicdb.dbo.RPT_RelatorioPlanoTrabalho(RPT_codigo)
);


-- pibicdb.dbo.SCO_SubComite definição

-- Drop table

-- DROP TABLE pibicdb.dbo.SCO_SubComite;

CREATE TABLE pibicdb.dbo.SCO_SubComite (
	SCO_codigo int IDENTITY(1,1) NOT NULL,
	SCO_sigla varchar(100) COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL,
	SCO_codigo_EVA int NOT NULL,
	SCO_descricao varchar(200) COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL,
	SCO_CpfTitular varchar(50) COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL,
	CONSTRAINT PK_SCO_SubComite PRIMARY KEY (SCO_codigo),
	CONSTRAINT FK_SCO_SubComite_EVA_EventoAtividadePEP FOREIGN KEY (SCO_codigo_EVA) REFERENCES pibicdb.dbo.EVA_EventoAtividadePEP(EVA_Codigo)
);


-- pibicdb.dbo.SSC_SubAreaSubComite definição

-- Drop table

-- DROP TABLE pibicdb.dbo.SSC_SubAreaSubComite;

CREATE TABLE pibicdb.dbo.SSC_SubAreaSubComite (
	SSC_codigo int IDENTITY(1,1) NOT NULL,
	SSC_codigo_SAR int NOT NULL,
	SSC_codigo_SCO int NOT NULL,
	CONSTRAINT PK_SSC_SubAreaSubComite PRIMARY KEY (SSC_codigo),
	CONSTRAINT FK_SSC_SubAreaSubComite_SAR_Subarea FOREIGN KEY (SSC_codigo_SAR) REFERENCES pibicdb.dbo.SAR_Subarea_user(SAR_codigo),
	CONSTRAINT FK_SSC_SubAreaSubComite_SCO_SubComite FOREIGN KEY (SSC_codigo_SCO) REFERENCES pibicdb.dbo.SCO_SubComite(SCO_codigo)
);


-- pibicdb.dbo.ABO_AvaliacaoBolsistaOrientador definição

-- Drop table

-- DROP TABLE pibicdb.dbo.ABO_AvaliacaoBolsistaOrientador;

CREATE TABLE pibicdb.dbo.ABO_AvaliacaoBolsistaOrientador (
	ABO_codigo int IDENTITY(1,1) NOT NULL,
	ABO_codigo_IVP int NOT NULL,
	ABO_codigo_RPT int NOT NULL,
	ABO_nota int NOT NULL,
	ABO_usuario varchar(11) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	CONSTRAINT PK_ABO_AvaliacaoBolsistaOrientador PRIMARY KEY (ABO_codigo),
	CONSTRAINT FK_ABO_AvaliacaoBolsistaOrientador_IVP_ItemAvaliacaoBolsistaPEP FOREIGN KEY (ABO_codigo_IVP) REFERENCES pibicdb.dbo.IVP_ItemAvaliacaoBolsistaPEP(IVP_codigo),
	CONSTRAINT FK_ABO_AvaliacaoBolsistaOrientador_RPT_RelatorioPlanoTrabalho FOREIGN KEY (ABO_codigo_RPT) REFERENCES pibicdb.dbo.RPT_RelatorioPlanoTrabalho(RPT_codigo)
);


-- pibicdb.dbo.AOB_AvaliacaoOrientadorBolsista definição

-- Drop table

-- DROP TABLE pibicdb.dbo.AOB_AvaliacaoOrientadorBolsista;

CREATE TABLE pibicdb.dbo.AOB_AvaliacaoOrientadorBolsista (
	AOB_codigo int IDENTITY(1,1) NOT NULL,
	AOB_codigo_IAP int NOT NULL,
	AOB_codigo_RPT int NOT NULL,
	AOB_nota int NOT NULL,
	AOB_usuario varchar(11) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	CONSTRAINT PK_AOB_AvaliacaoOrientadorBolsista PRIMARY KEY (AOB_codigo),
	CONSTRAINT FK_AOB_AvaliacaoOrientadorBolsista_IAP_ItemAvaliacaoOrientadorPEP FOREIGN KEY (AOB_codigo_IAP) REFERENCES pibicdb.dbo.IAP_ItemAvaliacaoOrientadorPEP(IAP_codigo),
	CONSTRAINT FK_AOB_AvaliacaoOrientadorBolsista_RPT_RelatorioPlanoTrabalho FOREIGN KEY (AOB_codigo_RPT) REFERENCES pibicdb.dbo.RPT_RelatorioPlanoTrabalho(RPT_codigo)
);


-- pibicdb.dbo.CAP_CategoriaAvaliacaoPeso definição

-- Drop table

-- DROP TABLE pibicdb.dbo.CAP_CategoriaAvaliacaoPeso;

CREATE TABLE pibicdb.dbo.CAP_CategoriaAvaliacaoPeso (
	CAP_codigo_SAR int NOT NULL,
	CAP_codigo_CAV int NOT NULL,
	CAP_peso real NOT NULL,
	CONSTRAINT PK_CAP_CategoriaAvaliacaoPeso PRIMARY KEY (CAP_codigo_SAR,CAP_codigo_CAV),
	CONSTRAINT FK_CAP_CategoriaAvaliacaoPeso_CAV_CategoriaAvaliacao FOREIGN KEY (CAP_codigo_CAV) REFERENCES pibicdb.dbo.CAV_CategoriaAvaliacao(CAV_codigo),
	CONSTRAINT FK_CAP_CategoriaAvaliacaoPeso_SAR_Subarea FOREIGN KEY (CAP_codigo_SAR) REFERENCES pibicdb.dbo.SAR_Subarea_user(SAR_codigo) ON DELETE CASCADE ON UPDATE CASCADE
);


-- pibicdb.dbo.OAV_OrientadorAvaliacao definição

-- Drop table

-- DROP TABLE pibicdb.dbo.OAV_OrientadorAvaliacao;

CREATE TABLE pibicdb.dbo.OAV_OrientadorAvaliacao (
	OAV_codigo int IDENTITY(1,1) NOT NULL,
	OAV_codigo_PRJ int NOT NULL,
	OAV_codigo_IPS int NOT NULL,
	OAV_pontuacao int NULL,
	OAV_codigo_PAR int NOT NULL,
	CONSTRAINT PK_OAV_OrientadorAvaliacao PRIMARY KEY (OAV_codigo),
	CONSTRAINT FK_OAV_OrientadorAvaliacao_IPS_ItemAvaliacaoPeso FOREIGN KEY (OAV_codigo_IPS) REFERENCES pibicdb.dbo.IPS_ItemAvaliacaoPeso(IPS_codigo),
	CONSTRAINT FK_OAV_OrientadorAvaliacao_PAR_ProjetoAvaliador FOREIGN KEY (OAV_codigo_PAR) REFERENCES pibicdb.dbo.PAR_ProjetoAvaliador(PAR_codigo),
	CONSTRAINT FK_OAV_OrientadorAvaliacao_PRJ_Projeto FOREIGN KEY (OAV_codigo_PRJ) REFERENCES pibicdb.dbo.PRJ_Projeto(PRJ_codigo)
);


-- pibicdb.dbo.PLD_PlanoDetalhe definição

-- Drop table

-- DROP TABLE pibicdb.dbo.PLD_PlanoDetalhe;

CREATE TABLE pibicdb.dbo.PLD_PlanoDetalhe (
	PLD_codigo int IDENTITY(1,1) NOT NULL,
	PLD_codigo_PRJ int NOT NULL,
	PLD_codigo_PLM int NOT NULL,
	PLD_codigo_PTR int NOT NULL,
	PLD_conteudo text COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL,
	CONSTRAINT PK_PLD_PlanoDetalhe PRIMARY KEY (PLD_codigo),
	CONSTRAINT FK_PLD_PlanoDetalhe_PLM_PlanoModelo FOREIGN KEY (PLD_codigo_PLM) REFERENCES pibicdb.dbo.PLM_PlanoModelo(PLM_codigo),
	CONSTRAINT FK_PLD_PlanoDetalhe_PRJ_Projeto FOREIGN KEY (PLD_codigo_PRJ) REFERENCES pibicdb.dbo.PRJ_Projeto(PRJ_codigo),
	CONSTRAINT FK_PLD_PlanoDetalhe_PTR_PlanoTrabalho FOREIGN KEY (PLD_codigo_PTR) REFERENCES pibicdb.dbo.PTR_PlanoTrabalho(PTR_codigo)
);


-- pibicdb.dbo.PRD_ProjetoDetalhe definição

-- Drop table

-- DROP TABLE pibicdb.dbo.PRD_ProjetoDetalhe;

CREATE TABLE pibicdb.dbo.PRD_ProjetoDetalhe (
	PRD_codigo int IDENTITY(1,1) NOT NULL,
	PRD_codigo_PRM int NOT NULL,
	PRD_codigo_PRJ int NOT NULL,
	PRD_conteudo text COLLATE SQL_Latin1_General_CP1_CI_AI NOT NULL,
	CONSTRAINT PK_PRD_ProjetoDetalhe PRIMARY KEY (PRD_codigo),
	CONSTRAINT FK_PRD_ProjetoDetalhe_PRJ_Projeto FOREIGN KEY (PRD_codigo_PRJ) REFERENCES pibicdb.dbo.PRJ_Projeto(PRJ_codigo),
	CONSTRAINT FK_PRD_ProjetoDetalhe_PRM_ProjetoModelo FOREIGN KEY (PRD_codigo_PRM) REFERENCES pibicdb.dbo.PRM_ProjetoModelo(PRM_codigo)
);


-- pibicdb.dbo.REC_Recurso definição

-- Drop table

-- DROP TABLE pibicdb.dbo.REC_Recurso;

CREATE TABLE pibicdb.dbo.REC_Recurso (
	REC_codigo int IDENTITY(1,1) NOT NULL,
	REC_codigo_PRJ int NULL,
	REC_codigo_SCO int NULL,
	REC_parecer text COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	REC_bolsasRecomendadas int NULL,
	REC_solicitacao text COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	REC_visibilidadeParecer varchar(1) COLLATE SQL_Latin1_General_CP1_CI_AI NULL,
	REC_codigo_TPR int NOT NULL,
	REC_codigo_SRE int DEFAULT 3 NOT NULL,
	REC_data datetime NULL,
	REC_codigo_IND int NULL,
	CONSTRAINT PK_REC_Recurso PRIMARY KEY (REC_codigo),
	CONSTRAINT FK_REC_Recurso_IND_Inadimplencia FOREIGN KEY (REC_codigo_IND) REFERENCES pibicdb.dbo.IND_Inadimplencia_user(IND_codigo),
	CONSTRAINT FK_REC_Recurso_PRJ_Projeto FOREIGN KEY (REC_codigo_PRJ) REFERENCES pibicdb.dbo.PRJ_Projeto(PRJ_codigo),
	CONSTRAINT FK_REC_Recurso_SCO_SubComite FOREIGN KEY (REC_codigo_SCO) REFERENCES pibicdb.dbo.SCO_SubComite(SCO_codigo),
	CONSTRAINT FK_REC_Recurso_SRE_StatusRecurso FOREIGN KEY (REC_codigo_SRE) REFERENCES pibicdb.dbo.SRE_StatusRecurso(SRE_codigo),
	CONSTRAINT FK_REC_Recurso_TPR_TipoRecurso FOREIGN KEY (REC_codigo_TPR) REFERENCES pibicdb.dbo.TPR_TipoRecurso(TPR_codigo)
);


-- dbo.AGE_AgenciaFinanciadora fonte

ALTER VIEW [dbo].[AGE_AgenciaFinanciadora] AS (
	SELECT AGE_codigo, AGE_Descricao, AGE_Sigla, AGE_Ch_Ativo, AGE_usuario 
	FROM pibicdb..AGE_AgenciaFinanciadora_user
	where suser_name() in('sisbiex','sapexmng') 
	and AGE_User = 'sisbiex' AND AGE_Ch_Ativo = 1
	UNION
	SELECT AGE_codigo, AGE_Descricao, AGE_Sigla, AGE_Ch_Ativo, AGE_usuario 
	FROM pibicdb..AGE_AgenciaFinanciadora_user 
	where suser_name() NOT IN ('sisbiex','sapexmng') 
	and AGE_User <> 'sisbiex' AND AGE_Ch_Ativo = 1
);


-- dbo.ARE_Area fonte

ALTER VIEW [dbo].[ARE_Area] as (
select ARE_codigo, ARE_ref, ARE_descricao
from ARE_Area_user 
where suser_name() in('sisbiex','sapexmng') 
and ARE_user = 'sisbiex' and ARE_ch_ativo = 'S'
UNION
select ARE_codigo, ARE_ref, ARE_descricao
from ARE_Area_user 
where suser_name() in('sispermng') 
and ARE_user <> 'sisbiex' and ARE_ch_ativo = 'S'
UNION
select ARE_codigo, ARE_ref, ARE_descricao
from ARE_Area_user 
where suser_name() not in ('sisbiex','sapexmng', 'sispermng') 
and ARE_user <> 'sisbiex' and ARE_user <> 'sispermng' and ARE_ch_ativo = 'S'
);


-- dbo.Alunos_ativos_regulares_grad_SISBIC fonte

ALTER VIEW [dbo].[Alunos_ativos_regulares_grad_SISBIC]
As

Select aln_nu_cpf,
       aln_nu_matricula_aluno
 From academdb..ALN_aluno
 Inner Join academdb..CRA_curso_aluno c1 On (cra_nu_matricula_aluno = aln_nu_matricula_aluno)
 Inner Join academdb..CRS_curso          On (     cra_cd_curso                 = crs_cd_curso
	                               And  cra_nu_periodo_curso_inicial = crs_nu_per_curso_inicial)
 Where crs_cd_curso > '100'
   and crs_cd_curso <> '999999'
   and crs_cd_grau_curso = '01'
   and c1.cra_nu_periodo_saida Is Null
   and aln_nu_cpf Is Not Null;


-- dbo.BOP_BolsistaProae fonte

ALTER VIEW [dbo].[BOP_BolsistaProae] as (
select PTR_Cpfaluno
from ptr_PlanoTrabalho
	inner join PRJ_Projeto ON PTR_codigo_PRJ = PRJ_codigo
	inner join PEP_PeriodoPrograma_user ON PRJ_codigo_PEP = PEP_codigo
WHERE PEP_user = 'sispermng' and PTR_Cpfaluno is not null and prj_codigo_prs = 3
);


-- dbo.EDF_EditalFormulario fonte

ALTER VIEW [dbo].[EDF_EditalFormulario] as
select  EDF_codigo,EDF_nomeArquivo,EDF_nomeExibicao,EDF_extensao,EDF_tipo,EDF_visivel, EDF_dataAtualizacao
from EDF_EditalFormulario_user
where EDF_usuario = suser_name();


-- dbo.IND_Inadimplencia fonte

ALTER VIEW [dbo].[IND_Inadimplencia]
AS
SELECT        IND_codigo_EVA, IND_data_liberacao, IND_data_insercao, IND_cpf_inadimplente, IND_cpf_liberacao, IND_motivo_liberacao, IND_ativo, IND_codigo
FROM            dbo.IND_Inadimplencia_user
WHERE        (IND_user = SYSTEM_USER);


-- dbo.NOT_Noticia fonte

ALTER VIEW [dbo].[NOT_Noticia] as
    select NOT_codigo, NOT_descricao, NOT_data, NOT_titulo, NOT_disponivel
from NOT_Noticia_user where NOT_user = system_user;


-- dbo.PEP_PeriodoPrograma fonte

ALTER VIEW [dbo].[PEP_PeriodoPrograma] as 
    select PEP_codigo, PEP_codigo_PRO, PEP_codigo_PPS, PEP_sigla, PEP_descricao, PEP_dtInicio, PEP_dtFim, PEP_edital, 
        PEP_editalArquivo,PEP_nmProjetos,PEP_nmPlanos,PEP_nmAvaliadores,PEP_avaliarProjeto,PEP_cpf_usuario
from PEP_PeriodoPrograma_user where PEP_user = system_user AND PEP_codigo_PPS <> 5;


-- dbo.PESQ_PINGIFES_ALUNO fonte

ALTER VIEW [dbo].[PESQ_PINGIFES_ALUNO]
as
select distinct PTR_Cpfaluno as CPF, BOL_dataInicio AS INICIO, BOL_dataFim AS FIM, BOL_codigo_AGE, AGE_Descricao as AGENCIA
from PTR_PlanoTrabalho
join BOL_Bolsista on BOL_codigo_PTR = PTR_codigo
join AGE_AgenciaFinanciadora on BOL_codigo_AGE = AGE_Codigo;


-- dbo.PESQ_PINGIFES_DOCENTE fonte

ALTER VIEW [dbo].[PESQ_PINGIFES_DOCENTE]
as
select distinct PRJ_cpfOrientador as CPF, BOL_dataInicio AS INICIO, BOL_dataFim AS FIM
from PRJ_Projeto
join PTR_PlanoTrabalho on PTR_codigo_PRJ = PRJ_codigo
join BOL_Bolsista on BOL_codigo_PTR = PTR_codigo;


-- dbo.SAR_Subarea fonte

ALTER VIEW [dbo].[SAR_Subarea] as (

select SAR_codigo, SAR_codigo_ARE, SAR_nmCnpq, SAR_ref, SAR_descricao
from SAR_Subarea_user
where suser_name() in ('sisbiex','sapexmng')
and SAR_user = 'sisbiex' and SAR_ch_ativo = 'S'
UNION
select SAR_codigo, SAR_codigo_ARE, SAR_nmCnpq, SAR_ref, SAR_descricao
from SAR_Subarea_user
where suser_name() in ('sispermng')
and SAR_user <> 'sisbiex' and SAR_ch_ativo = 'S'
UNION
select SAR_codigo, SAR_codigo_ARE, SAR_nmCnpq, SAR_ref, SAR_descricao
from SAR_Subarea_user
where suser_name() not in ('sisbiex','sapexmng', 'sispermng')
and SAR_user <> 'sisbiex' and SAR_user <> 'sispermng' and SAR_ch_ativo = 'S'

);


-- dbo.bolsas_ativas fonte

ALTER view bolsas_ativas
as
select BOL_cpfAluno
from BOL_Bolsista
where BOL_dataFim > '01/02/2013';


-- dbo.tabel fonte

ALTER view tabel as SELECT  IDENT_CURRENT('IPR_ItemAvaliacaoProjeto') as chave;


-- dbo.tabela fonte

ALTER view tabela as 
         select count(*) as tot from CIC_CategoriaItemCriterioPeriodoAvaliacaoRelatorio where CIC_codigo_IAR is null and CIC_codigo_CRR is null;


-- dbo.vw_email_orientadores fonte

ALTER VIEW [dbo].[vw_email_orientadores]
as select pes_nm_pessoa NOME, pef_nu_cpf CPF, PEP_Sigla PROGRAMA, PRJ_titulo PROJETO, (select top 1 eml_nm_email from ufbadb..eml_email where pef_cd_pessoa = eml_cd_pessoa) EMAIL 
from
PRJ_Projeto join ufbadb..Pef_pessoa_fisica on (pef_nu_cpf = PRJ_cpfOrientador)
join ufbadb..pes_pessoa on (pef_cd_pessoa = pes_cd_pessoa)
join PEP_PeriodoPrograma on (PEP_Codigo = PRJ_codigo_PEP)
group by pes_nm_pessoa, pef_nu_cpf, PEP_Sigla, PRJ_titulo, pef_cd_pessoa;


-- dbo.vw_email_sisbic fonte

ALTER VIEW [dbo].[vw_email_sisbic]
as select pes_nm_pessoa NOME, pef_nu_cpf CPF, PEP_Sigla PROGRAMA, PRJ_titulo PROJETO, (select top 1 eml_nm_email from ufbadb..eml_email where pef_cd_pessoa = eml_cd_pessoa) EMAIL 
from
PRJ_Projeto join ufbadb..Pef_pessoa_fisica on (pef_nu_cpf = PRJ_cpfOrientador)
join ufbadb..pes_pessoa on (pef_cd_pessoa = pes_cd_pessoa)
join PEP_PeriodoPrograma on (PEP_Codigo = PRJ_codigo_PEP)
union
select pes_nm_pessoa NOME, pef_nu_cpf CPF, PEP_Sigla PROGRAMA, PRJ_titulo PROJETO, (select top 1 eml_nm_email from ufbadb..eml_email where pef_cd_pessoa = eml_cd_pessoa) EMAIL 
from
PRJ_Projeto 
join PTR_PlanoTrabalho on (PTR_codigo_PRJ = PRJ_codigo)
join ufbadb..Pef_pessoa_fisica on (pef_nu_cpf = PTR_Cpfaluno)
join ufbadb..pes_pessoa on (pef_cd_pessoa = pes_cd_pessoa)
join PEP_PeriodoPrograma on (PEP_Codigo = PRJ_codigo_PEP)
group by pes_nm_pessoa, pef_nu_cpf, PEP_Sigla, PRJ_titulo, pef_cd_pessoa;