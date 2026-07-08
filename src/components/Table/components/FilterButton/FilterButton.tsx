import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';

import { Button } from '#/components/Button';
import { Dialog } from '#/components/Dialog';
import { useDialog } from '#/components/Dialog/hooks/useDialog';

import type { FiltersButtonPropsDef } from './FilterButton.types';

export const FilterButton = (props: FiltersButtonPropsDef) => {
  const { FiltersContent, onReset, onSubmit } = props;

  const [showFilters, hideFilters] = useDialog(() => {
    return (
      <Dialog
        Footer={() => {
          return (
            <>
              <Button
                onClick={async () => {
                  hideFilters();
                  await onReset();
                }}
                text="Reset Filters"
                variant="mono"
              />
              <Button
                Icon={SearchIcon}
                onClick={() => {
                  onSubmit();
                }}
                text="View Results"
              />
            </>
          );
        }}
        Header="Filters"
        onClose={hideFilters}
      >
        <FiltersContent />
      </Dialog>
    );
  }, []);

  return (
    <Button
      Icon={FilterAltIcon}
      onClick={showFilters}
      size="sm"
      text="Filter"
      variant="mono"
    />
  );
};
