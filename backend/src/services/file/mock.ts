export const successScanResult = (fileName: string) => {
  return {
    Magic: "CLAMJSONv0",
    RootFileType: "CL_TYPE_TEXT_ASCII",
    FileName: fileName,
    FileType: "CL_TYPE_TEXT_ASCII",
    FileSize: 7,
    FileMD5: "477fd39992f3c58b7a122d2d97e4abf3",
  };
};

const shuffle = (arr: unknown[]) => {
  const shuffled = arr.sort(() => Math.random() - 0.5);
  return shuffled;
};

const getRandomSample = (arr: unknown[]) => {
  return shuffle(arr).slice(0, Math.floor(Math.random() * arr.length + 1));
};

export const virusScanResult = (fileName: string) => {
  return {
    Magic: "CLAMJSONv0",
    RootFileType: "CL_TYPE_TEXT_ASCII",
    FileName: fileName,
    FileType: "CL_TYPE_TEXT_ASCII",
    FileSize: 7,
    FileMD5: "477fd39992f3c58b7a122d2d97e4abf3",
    Viruses: getRandomSample([
      "Eicar-Signature",
      "Exploit.Win32.CVE-2017-0199",
      "Trojan.GenericKD.409090",
      "Keylogger.Win32.Generic",
    ]),
  };
};
