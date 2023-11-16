export interface ProfileInfoData {
  dataTitle: string;
  dataInfo: string;
  isStrong?: boolean;
  isHidden?: boolean;
}

export interface InfoCardProps {
  iconSrc: string;
  title: string;
  data: Array<ProfileInfoData>;
}
